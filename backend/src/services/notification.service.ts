import { Notification } from "../models/notification.model";
import { GetNotificationDTO, CreateNotificationDTO } from "../dtos/notification.dto";

import { client } from "../db/config";
import { wss } from "../index";

import boom from "@hapi/boom";

export class NotificationService {
    constructor() {}

    async getNotifications(userId: Notification["userId"], types: Notification["type"][] = []): Promise<GetNotificationDTO[]> {
        
        const notifications = types.length > 0 ? await client.query(
            "SELECT idnotification id, type, message FROM notifications WHERE user_id = $1 AND type = ANY($2) ORDER BY idnotification DESC",
            [userId, types]
        ) : await client.query(
            "SELECT idnotification id, type, message FROM notifications WHERE user_id = $1 ORDER BY idnotification DESC",
            [userId]
        );
        if (!notifications.rows[0]) throw boom.notFound("No notifications found");
        return notifications.rows;
    }

    async createNotification(userId: Notification["userId"], notification: CreateNotificationDTO): Promise<GetNotificationDTO | string> {
        const { type, message } = notification;

        if (type < 0 || type > 4) throw boom.badRequest("Invalid notification type");

        const newNotification = await client.query(
            "INSERT INTO notifications (type, message, user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING idnotification id, type, message",
            [type, message, userId, new Date()]
        );

        const contacts = await client.query(
            "SELECT called FROM contacts WHERE caller = $1",
            [userId]
        );

        const contactsIds = Object.values(contacts.rows).map((contact) => contact.called);
        wss.clients.forEach((client) => {
            client.send(
                JSON.stringify({
                    type: "notification",
                    data: {
                        id: newNotification.rows[0].id,
                        type: newNotification.rows[0].type,
                        message: newNotification.rows[0].message,
                        users: [...contactsIds, userId]
                    },
                })
            );
        });

        return newNotification.rows[0];
    }
}
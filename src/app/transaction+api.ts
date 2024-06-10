import { ExpoRequest, ExpoResponse } from "expo-router/server"

import connection from '~/db/connection';
import { ITransaction } from "~/interfaces";

export async function GET(request : ExpoRequest): Promise<ExpoResponse> {
    return new Promise((resolve, reject) => {
        const userId = request.expoUrl.searchParams.get('userId')

        if (!userId) {
            reject(ExpoResponse.json({ error: 'ID do usuário não fornecido' }));
            return;
        }

        const query = 'SELECT T.ID, '+
                             'T.DESCRIPTION, '+
                             'T.VALUE, '+
                             'T.TRANSACTION_DATE AS DATE, '+
                             'T.IS_EXPENSE, '+
                             'I.NAME_FONT AS ICON, '+
                             'T.ID_WALLET AS WALLET '+
                      'FROM TRANSACTIONS T '+
                      'INNER JOIN WALLET W ON W.ID = T.ID_WALLET '+
                      'INNER JOIN USER U ON U.ID = W.ID_USER '+
                      'INNER JOIN CATEGORY C ON C.ID = T.ID_CATEGORY '+
                      'INNER JOIN ICON I ON I.ID = C.ID_ICON '+
                      'WHERE U.ID = ?';

        connection.query(query, [userId], (error, results, fields) => {
            if (error) {
                console.error('Erro ao executar a consulta:', error);
                reject(ExpoResponse.json({ error: 'Erro ao executar a consulta' }));
                return;
            }

            const transactions: ITransaction[] = results.map((row: any) => ({
                id: row.ID,
                description: row.DESCRIPTION,
                value: row.VALUE,
                date: row.DATE,
                is_expense: row.IS_EXPENSE,
                icon: row.ICON,
                wallet: row.WALLET,
            }));
            
            resolve(ExpoResponse.json({ data: transactions }));
        });
    });
}
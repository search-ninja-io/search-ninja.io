// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handler(event: any, context: any): Promise<any> {
    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({
            message: 'Hello from Azure AD Token Handler!',
            event: event,
            context: context,
        }),
    };
}

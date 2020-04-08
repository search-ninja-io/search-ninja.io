export async function handler(event: any, context: any) {
    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({
            message: "Hello from Azure AD Token Handler!",
            event: event,
            context: context
        })
    };
}
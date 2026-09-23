export const ok = (body) => { 
    return {
        body: body,
        success: true,
        statusCode: 200,
    }
}

export const notFound = () => { 
    return {
        success: false,
        statusCode: 404, // Status correto para não encontrado
        body: 'Não encontrado!'
    }
}

// CORREÇÃO AQUI: Retorna a mensagem de erro real e status 500 (Server Error)
export const serverError = (error) => { 
    console.error(error, "giovanni");

    return {
        success: false,
        statusCode: 500,
        body: {
            message: error.message,
            stack: error.stack
        }
    };
}   
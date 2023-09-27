interface ErrorResponse {
    errors: {
        status: number;
        source: string;
        title: string;
        message: string;
    };
}

export default ErrorResponse;

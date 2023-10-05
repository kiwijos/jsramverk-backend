interface ErrorResponse {
    errors: {
        status: number;
        source: string;
        title: string;
        detail: string;
    };
}

export default ErrorResponse;

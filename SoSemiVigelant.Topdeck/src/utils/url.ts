export interface UrlConfig {
    protocol?: string;
    user?: string;
    password?: string;
    host: string;
    port?: string;
    path?: string;
    query?: string;
}

export class Url {
    constructor(private config: UrlConfig) {

    }

    toString() {
        const protocol = this.config.protocol ? `${this.config.protocol}`: '';
        const port = this.config.port ? `:${this.config.port}`: '';
        const path = this.config.path ? `/${this.config.path}`: '';
        const query = this.config.query ? `?${this.config.query}`: '';
        const credentials = this.config.user && this.config.password
            ? `${this.config.user}:${this.config.password}@`
            : '';
        return `${protocol}://${credentials}${this.config.host}${port}${path}${query}`
    }
}
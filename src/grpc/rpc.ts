import { grpc } from '@improbable-eng/grpc-web';

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

export class GrpcWebRpc implements Rpc {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            grpc.unary((window as any)[service][method], {
                request: { serializeBinary: () => data, toObject: () => ({}) },
                host: this.host,
                onEnd: res => {
                    if (res.status === grpc.Code.OK && res.message) {
                        resolve(res.message.serializeBinary());
                    } else {
                        reject(new Error(res.statusMessage));
                    }
                },
            });
        });
    }
}

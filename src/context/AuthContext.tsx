import { UserProfile } from "@/types/strategy";
import { createContext, useContext, useEffect, useState } from "react";
import { useRawInitData, isTMA } from '@tma.js/sdk-react';
import { PerpxServiceClientImpl, ProfileRequest, TelegramLoginRequest, GrpcWebImpl, PerpxService } from "@/grpc/perpx";
import { grpc } from "@improbable-eng/grpc-web";

interface AuthContextType {
    user: UserProfile | null;
    rpc: PerpxService;
    getToken: () => string | null;
}

const TOKEN_KEY = "perpx_token";
let rpcURL: string

if (process.env.NODE_ENV === 'development') {
    rpcURL = 'http://localhost:8080'
} else {
    rpcURL = 'https://perpx-api.bitsflea.com'
}

const rpc = new GrpcWebImpl(rpcURL, { transport: grpc.CrossBrowserHttpTransport({ withCredentials: false }) })
const client = new PerpxServiceClientImpl(rpc);

const AuthContext = createContext<AuthContextType | null>(null);

function getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
}

async function getUserInfo(token: string) {
    try {
        const req = ProfileRequest.create({ token })
        return await client.getProfile(req)
    } catch (e) {
        console.error("getUserInfo error:", e)
    }
    return null
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const rawInitData = useRawInitData()

    console.debug("rawInitData:", rawInitData)

    useEffect(() => {
        console.debug('isTMA:', isTMA());
        const userInfo = async () => {
            const token = getToken()
            console.debug("token:", token)
            if (token) {
                const userInfo = await getUserInfo(token)
                console.log("userInfo:", userInfo)
                if (userInfo) {
                    setUser(userInfo as UserProfile)
                } else {
                    localStorage.removeItem(TOKEN_KEY)
                }
            } else if (isTMA()) {
                const req = TelegramLoginRequest.create({ initData: rawInitData })
                console.debug("req:", req)
                const res = await client.loginWithTelegram(req)
                console.debug("res:", res)
                if (res) {
                    localStorage.setItem(TOKEN_KEY, res.token)
                }
                const userInfo = await getUserInfo(res.token)
                console.debug("userInfo:", userInfo)
                if (userInfo) {
                    const ui = userInfo as UserProfile
                    setUser(ui)
                }
            }
        }
        userInfo()
    }, [])

    return (
        <AuthContext.Provider value={{ user, rpc: client, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
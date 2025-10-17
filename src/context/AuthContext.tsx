import { UserProfile } from "@/types/strategy";
import { createContext, useContext, useEffect, useState } from "react";
import { useRawLaunchParams, initData } from '@telegram-apps/sdk-react';
import { isTMA } from '@telegram-apps/bridge';
import { PerpxServiceClientImpl, ProfileRequest, TelegramLoginRequest } from "@/grpc/perpx";
import { GrpcWebRpc } from "@/grpc/rpc";

interface AuthContextType {
    user: UserProfile | null;
}

const TOKEN_KEY = "perpx_token";
const rpc = new GrpcWebRpc('http://api.bitsflea.com:8080')
const client = new PerpxServiceClientImpl(rpc);

const AuthContext = createContext<AuthContextType | null>(null);

function getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
}

async function getUserInfo(token: string) {
    try {
        const req = ProfileRequest.create({ token })
        return await client.GetProfile(req)
    } catch (e) {
        console.error("getUserInfo error:", e)
    }
    return null
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        console.log('isTMA:', isTMA());
        const userInfo = async () => {
            const token = getToken()
            if (token) {
                const userInfo = await getUserInfo(token)
                if (userInfo) {
                    setUser(userInfo as UserProfile)
                } else {
                    localStorage.removeItem(TOKEN_KEY)
                }
            } else if (isTMA()) {
                const req = TelegramLoginRequest.create({ initData: useRawLaunchParams() })
                const tgUserInfo = initData.user()
                console.log("tgUserInfo:", tgUserInfo)
                const res = await client.LoginWithTelegram(req)
                console.log("res:", res)
                if (res) {
                    localStorage.setItem(TOKEN_KEY, res.token)
                }
                const userInfo = await getUserInfo(res.token)
                console.log("userInfo:", userInfo)
                if (userInfo) {
                    const ui = userInfo as UserProfile
                    ui.avatar = tgUserInfo?.photo_url
                    setUser(ui)
                }
            }
        }
        userInfo()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
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
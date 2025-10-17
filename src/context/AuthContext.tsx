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
        console.error(e)
    }
    return null
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const userInfo = async () => {
            const token = getToken()
            if (token) {
                const req = ProfileRequest.create({ token })
                const userInfo = await client.GetProfile(req)
                if (userInfo) {
                    setUser(userInfo as UserProfile)
                }
            } else if (isTMA()) {
                const req = TelegramLoginRequest.create({ initData: useRawLaunchParams() })
                const tgUserInfo = initData.user()
                const res = await client.LoginWithTelegram(req)
                if (res) {
                    localStorage.setItem(`${TOKEN_KEY}_${tgUserInfo?.id}`, res.token)
                }
                const userInfo = await client.GetProfile(ProfileRequest.create({ token: res.token }))
                if (userInfo) {
                    setUser(userInfo as UserProfile)
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
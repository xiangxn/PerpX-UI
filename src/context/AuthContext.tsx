import { UserProfile } from "@/types/strategy";
import { createContext, useContext, useEffect, useState } from "react";
import { initData } from '@telegram-apps/sdk-react';
import { isTMA } from '@telegram-apps/bridge';
import { PerpxServiceClientImpl, ProfileRequest, TelegramLoginRequest, GrpcWebImpl } from "@/grpc/perpx";
import { grpc } from "@improbable-eng/grpc-web";

interface AuthContextType {
    user: UserProfile | null;
}

const TOKEN_KEY = "perpx_token";
const rpc = new GrpcWebImpl('https://perpx-api.bitsflea.com', { transport: grpc.CrossBrowserHttpTransport({ withCredentials: false }) })
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

    useEffect(() => {
        console.log('isTMA=', isTMA());
        const userInfo = async () => {
            const token = getToken()
            console.log("token:", token)
            if (token) {
                const userInfo = await getUserInfo(token)
                console.log("userInfo:", userInfo)
                if (userInfo) {
                    setUser(userInfo as UserProfile)
                } else {
                    localStorage.removeItem(TOKEN_KEY)
                }
            } else if (isTMA()) {
                initData.restore()
                // const launchParams = retrieveLaunchParams();
                // console.debug("launchParams:", launchParams)
                console.debug("userInfo:", initData.user())
                console.debug("initData:", (window as any).Telegram.WebApp.initData)
                const req = TelegramLoginRequest.create({ initData: initData.raw() })
                console.log("req:", req)
                const res = await client.loginWithTelegram(req)
                console.log("res:", res)
                if (res) {
                    localStorage.setItem(TOKEN_KEY, res.token)
                }
                const userInfo = await getUserInfo(res.token)
                console.log("userInfo:", userInfo)
                if (userInfo) {
                    const ui = userInfo as UserProfile
                    // ui.avatar = initData?.user?.photo_url
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
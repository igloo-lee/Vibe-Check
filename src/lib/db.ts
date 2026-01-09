
import { supabase } from './supabase';
import { LandingScreenData, Message } from '../types';

export const createSession = async (data: LandingScreenData): Promise<string | null> => {
    try {
        const { data: session, error } = await supabase
            .from('sessions')
            .insert([
                {
                    my_nickname: data.myNickname,
                    partner_name: data.partnerName,
                    relationship: data.relationship,
                    worry_content: data.worryContent,
                },
            ])
            .select('id')
            .single();

        if (error) {
            console.error('Error creating session:', error);
            return null;
        }

        return session.id;
    } catch (err) {
        console.error('Unexpected error creating session:', err);
        return null;
    }
};

export const saveMessage = async (sessionId: string, message: Message) => {
    try {
        const { error } = await supabase.from('messages').insert([
            {
                session_id: sessionId,
                content: message.text,
                is_user: message.isUser,
                created_at: message.timestamp.toISOString(),
            },
        ]);

        if (error) {
            console.error('Error saving message:', error);
        }
    } catch (err) {
        console.error('Unexpected error saving message:', err);
    }
};


export const updateSessionEmail = async (sessionId: string, email: string) => {
    try {
        const { error } = await supabase
            .from('sessions')
            .update({ user_email: email })
            .eq('id', sessionId);

        if (error) {
            console.error('Error updating session email:', error);
        }
    } catch (err) {
        console.error('Unexpected error updating session email:', err);
    }
};

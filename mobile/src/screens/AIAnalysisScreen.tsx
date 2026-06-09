import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { incrementDailyStat } from '../data/dailyStats';
import { askEhliyetAI } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const QUICK_REPLIES = [
  "Motor hararet yaparsa ne yapmalıyım?",
  "İlk yardımın ABC'si nedir?",
  "Kırmızı ışık cezası ne kadar?",
  "Hız sınırları nelerdir?"
];

export function AIAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben EhliyetAI. Trafik, İlk Yardım veya Motor konularında aklınıza takılan soruları bana sorabilirsiniz.',
      isUser: false,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      incrementDailyStat('ai');
      // Ekrana her gelindiğinde sohbeti sıfırlıyoruz
      setMessages([
        {
          id: '1',
          text: 'Merhaba! Ben EhliyetAI. Trafik, İlk Yardım veya Motor konularında aklınıza takılan soruları bana sorabilirsiniz.',
          isUser: false,
        }
      ]);
      setInputText('');
    }, [])
  );

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    Keyboard.dismiss();

    // Geçmiş mesajları AI'ın beklediği formata dönüştür
    const history = messages.map(m => ({
      role: m.isUser ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const aiResponseText = await askEhliyetAI(userMsg.text, history);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponseText,
      isUser: false,
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const onSendPress = () => handleSend(inputText);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.isUser;
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        {!isUser && (
          <View style={styles.avatarAI}>
            <Ionicons name="hardware-chip" size={16} color="#3b82f6" />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAI]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Özel Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="sparkles" size={20} color="#3b82f6" />
          </View>
          <View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>EhliyetAI Asistanı</Text>
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.headerSubtitle}>Sınav soruları için 7/24 aktif</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Hızlı Soru Butonları (Oto Sorular) */}
        {!isLoading && messages.length <= 2 && (
          <View style={styles.quickReplyContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplyScroll}>
              {QUICK_REPLIES.map((reply, index) => (
                <TouchableOpacity key={index} style={styles.quickReplyButton} onPress={() => handleSend(reply)}>
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={onSendPress}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={onSendPress}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  onlineBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  avatarAI: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleUser: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  messageBubbleAI: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  messageTextUser: {
    color: '#ffffff',
    fontWeight: '500',
  },
  messageTextAI: {
    color: '#334155',
    fontWeight: '400',
  },
  quickReplyContainer: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  quickReplyScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 15,
    color: '#0f172a',
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
});

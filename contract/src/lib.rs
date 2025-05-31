#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Symbol, Vec, Map, String
};

// Hediye programlama için veri yapısı
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ScheduledGift {
    pub id: u64,
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
    pub special_day: String,
    pub scheduled_date: u64, // Unix timestamp
    pub description: String,
    pub status: GiftStatus,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GiftStatus {
    Pending,
    Sent,
    Failed,
    Cancelled,
}

// Contract storage keys
const GIFT_COUNTER: Symbol = symbol_short!("COUNTER");
const GIFTS: Symbol = symbol_short!("GIFTS");
const USER_GIFTS: Symbol = symbol_short!("USERGIFT");

#[contract]
pub struct GiftingContract;

#[contractimpl]
impl GiftingContract {
    /// Yeni bir hediye programlar
    pub fn schedule_gift(
        env: Env,
        sender: Address,
        recipient: Address,
        amount: i128,
        special_day: String,
        scheduled_date: u64,
        description: String,
    ) -> u64 {
        // Gönderici adresini doğrula
        sender.require_auth();
        
        // Miktar pozitif olmalı
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Tarih gelecekte olmalı
        let current_time = env.ledger().timestamp();
        if scheduled_date <= current_time {
            panic!("Scheduled date must be in the future");
        }
        
        // Yeni gift ID oluştur
        let mut counter = env.storage().persistent().get(&GIFT_COUNTER).unwrap_or(0u64);
        counter += 1;
        
        // Yeni hediye oluştur
        let gift = ScheduledGift {
            id: counter,
            sender: sender.clone(),
            recipient,
            amount,
            special_day,
            scheduled_date,
            description,
            status: GiftStatus::Pending,
            created_at: current_time,
        };
        
        // Storage'a kaydet
        env.storage().persistent().set(&GIFT_COUNTER, &counter);
        
        // Gifts map'ine ekle
        let gifts_key = (GIFTS, counter);
        env.storage().persistent().set(&gifts_key, &gift);
        
        // User gifts listesine ekle
        let user_key = (USER_GIFTS, sender.clone());
        let mut user_gifts: Vec<u64> = env.storage().persistent()
            .get(&user_key).unwrap_or(Vec::new(&env));
        user_gifts.push_back(counter);
        env.storage().persistent().set(&user_key, &user_gifts);
        
        // Event emit et
        env.events().publish(
            (symbol_short!("scheduled"), sender),
            (counter, gift.scheduled_date)
        );
        
        counter
    }
    
    /// Programlanan hediyeyi gönderir (manuel tetikleme)
    pub fn send_gift(env: Env, gift_id: u64, sender: Address) -> bool {
        sender.require_auth();
        
        let gifts_key = (GIFTS, gift_id);
        let mut gift: ScheduledGift = env.storage().persistent()
            .get(&gifts_key)
            .expect("Gift not found");
        
        // Sadece hediye sahibi gönderebilir
        if gift.sender != sender {
            panic!("Only gift sender can send the gift");
        }
        
        // Sadece pending durumundaki hediyeler gönderilebilir
        if gift.status != GiftStatus::Pending {
            panic!("Gift is not in pending status");
        }
        
        // Burada gerçek token transferi yapılacak
        // Şimdilik status'u güncelleyerek simüle ediyoruz
        gift.status = GiftStatus::Sent;
        env.storage().persistent().set(&gifts_key, &gift);
        
        // Event emit et
        env.events().publish(
            (symbol_short!("sent"), gift.sender.clone()),
            (gift_id, gift.recipient.clone())
        );
        
        true
    }
    
    /// Programlanan hediyeyi iptal eder
    pub fn cancel_gift(env: Env, gift_id: u64, sender: Address) -> bool {
        sender.require_auth();
        
        let gifts_key = (GIFTS, gift_id);
        let mut gift: ScheduledGift = env.storage().persistent()
            .get(&gifts_key)
            .expect("Gift not found");
        
        // Sadece hediye sahibi iptal edebilir
        if gift.sender != sender {
            panic!("Only gift sender can cancel the gift");
        }
        
        // Sadece pending durumundaki hediyeler iptal edilebilir
        if gift.status != GiftStatus::Pending {
            panic!("Gift is not in pending status");
        }
        
        gift.status = GiftStatus::Cancelled;
        env.storage().persistent().set(&gifts_key, &gift);
        
        // Event emit et
        env.events().publish(
            (symbol_short!("cancelled"), sender),
            gift_id
        );
        
        true
    }
    
    /// Belirli bir hediyenin detaylarını getirir
    pub fn get_gift(env: Env, gift_id: u64) -> Option<ScheduledGift> {
        let gifts_key = (GIFTS, gift_id);
        env.storage().persistent().get(&gifts_key)
    }
    
    /// Kullanıcının tüm hediyelerini getirir
    pub fn get_user_gifts(env: Env, user: Address) -> Vec<ScheduledGift> {
        let user_key = (USER_GIFTS, user);
        let gift_ids: Vec<u64> = env.storage().persistent()
            .get(&user_key).unwrap_or(Vec::new(&env));
        
        let mut gifts = Vec::new(&env);
        for id in gift_ids.iter() {
            let gifts_key = (GIFTS, id);
            if let Some(gift) = env.storage().persistent().get::<(Symbol, u64), ScheduledGift>(&gifts_key) {
                gifts.push_back(gift);
            }
        }
        
        gifts
    }
    
    /// Belirli bir tarihteki tüm pending hediyeleri getirir (otomatik gönderim için)
    pub fn get_pending_gifts_by_date(env: Env, target_date: u64) -> Vec<ScheduledGift> {
        // Bu fonksiyon gerçek implementasyonda daha verimli bir şekilde yapılmalı
        // Şimdilik basit bir implementasyon
        let mut pending_gifts = Vec::new(&env);
        let counter = env.storage().persistent().get(&GIFT_COUNTER).unwrap_or(0u64);
        
        for i in 1..=counter {
            let gifts_key = (GIFTS, i);
            if let Some(gift) = env.storage().persistent().get::<(Symbol, u64), ScheduledGift>(&gifts_key) {
                match gift.status {
                    GiftStatus::Pending => total_pending += 1,
                    GiftStatus::Sent => total_sent += 1,
                    GiftStatus::Cancelled => total_cancelled += 1,
                    _ => {}
                }
                total_amount += gift.amount;
            }
        }
        
        stats.set(String::from_str(&env, "total_gifts"), counter as i128);
        stats.set(String::from_str(&env, "pending_gifts"), total_pending);
        stats.set(String::from_str(&env, "sent_gifts"), total_sent);
        stats.set(String::from_str(&env, "cancelled_gifts"), total_cancelled);
        stats.set(String::from_str(&env, "total_amount"), total_amount);
        
        stats
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    #[test]
    fn test_schedule_gift() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GiftingContract);
        let client = GiftingContractClient::new(&env, &contract_id);

        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        // Mock ledger timestamp
        env.mock_all_auths();
        env.ledger().with_mut(|li| li.timestamp = 1000);

        let gift_id = client.schedule_gift(
            &sender,
            &recipient,
            &1000000, // 10 XLM (7 decimal places)
            &String::from_str(&env, "Birthday"),
            &2000, // Future timestamp
            &String::from_str(&env, "Happy Birthday!")
        );

        assert_eq!(gift_id, 1);

        let gift = client.get_gift(&gift_id).unwrap();
        assert_eq!(gift.sender, sender);
        assert_eq!(gift.recipient, recipient);
        assert_eq!(gift.amount, 1000000);
        assert_eq!(gift.status, GiftStatus::Pending);
    }

    #[test]
    fn test_send_gift() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GiftingContract);
        let client = GiftingContractClient::new(&env, &contract_id);

        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        env.mock_all_auths();
        env.ledger().with_mut(|li| li.timestamp = 1000);

        let gift_id = client.schedule_gift(
            &sender,
            &recipient,
            &1000000,
            &String::from_str(&env, "Anniversary"),
            &2000,
            &String::from_str(&env, "Happy Anniversary!")
        );

        let result = client.send_gift(&gift_id, &sender);
        assert_eq!(result, true);

        let gift = client.get_gift(&gift_id).unwrap();
        assert_eq!(gift.status, GiftStatus::Sent);
    }

    #[test]
    fn test_cancel_gift() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GiftingContract);
        let client = GiftingContractClient::new(&env, &contract_id);

        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        env.mock_all_auths();
        env.ledger().with_mut(|li| li.timestamp = 1000);

        let gift_id = client.schedule_gift(
            &sender,
            &recipient,
            &1000000,
            &String::from_str(&env, "Valentine"),
            &2000,
            &String::from_str(&env, "Happy Valentine's Day!")
        );

        let result = client.cancel_gift(&gift_id, &sender);
        assert_eq!(result, true);

        let gift = client.get_gift(&gift_id).unwrap();
        assert_eq!(gift.status, GiftStatus::Cancelled);
    }

    #[test]
    fn test_get_user_gifts() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GiftingContract);
        let client = GiftingContractClient::new(&env, &contract_id);

        let sender = Address::generate(&env);
        let recipient1 = Address::generate(&env);
        let recipient2 = Address::generate(&env);
        
        env.mock_all_auths();
        env.ledger().with_mut(|li| li.timestamp = 1000);

        // Schedule multiple gifts
        client.schedule_gift(
            &sender,
            &recipient1,
            &1000000,
            &String::from_str(&env, "Birthday"),
            &2000,
            &String::from_str(&env, "Gift 1")
        );

        client.schedule_gift(
            &sender,
            &recipient2,
            &2000000,
            &String::from_str(&env, "Anniversary"),
            &3000,
            &String::from_str(&env, "Gift 2")
        );

        let user_gifts = client.get_user_gifts(&sender);
        assert_eq!(user_gifts.len(), 2);
    }
}
            if let Some(gift) = env.storage().persistent().get::<(Symbol, u64), ScheduledGift>(&gifts_key) {
                if gift.status == GiftStatus::Pending && gift.scheduled_date <= target_date {
                    pending_gifts.push_back(gift);
                }
            }
        }
        
        pending_gifts
    }
    
    /// Toplam programlanan hediye sayısını getirir
    pub fn get_total_gifts_count(env: Env) -> u64 {
        env.storage().persistent().get(&GIFT_COUNTER).unwrap_or(0u64)
    }
    
    /// Kullanıcının pending hediye sayısını getirir
    pub fn get_user_pending_count(env: Env, user: Address) -> u32 {
        let user_gifts = Self::get_user_gifts(env, user);
        let mut count = 0u32;
        
        for gift in user_gifts.iter() {
            if gift.status == GiftStatus::Pending {
                count += 1;
            }
        }
        
        count
    }
    
    /// Contract'ın durumunu getirir (istatistikler için)
    pub fn get_contract_stats(env: Env) -> Map<String, i128> {
        let mut stats = Map::new(&env);
        let counter = env.storage().persistent().get(&GIFT_COUNTER).unwrap_or(0u64);
        
        let mut total_pending = 0i128;
        let mut total_sent = 0i128;
        let mut total_cancelled = 0i128;
        let mut total_amount = 0i128;
        
        for i in 1..=counter {
            let gifts_key = (GIFTS, i);
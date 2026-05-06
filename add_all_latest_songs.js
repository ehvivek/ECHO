const fs = require('fs');

const easySongs = [
  { s: 'Kesariya', m: 'Brahmastra', y: 2022, a: ['Arijit Singh'], h: 'केसरिया तेरा इश्क़ है पिया, रंग जाऊँ जो मैं हाथ लगाऊँ', hr: 'Kesariya tera ishq hai piya, rang jaun jo main haath lagaun', e: 'Your love is the color of saffron. If I even touch it, I become completely dyed in its hue.', d: 'easy' },
  { s: 'Apna Bana Le', m: 'Bhediya', y: 2022, a: ['Arijit Singh'], h: 'अपना बना ले पिया, अपना बना ले पिया', hr: 'Apna bana le piya, apna bana le piya', e: 'Make me yours, my love. Make me entirely your own.', d: 'easy' },
  { s: 'Tere Hawaale', m: 'Laal Singh Chaddha', y: 2022, a: ['Arijit Singh', 'Shilpa Rao'], h: 'तेरे हवाले कर दिया, खुद को तेरे हवाले', hr: 'Tere hawaale kar diya, khud ko tere hawaale', e: 'I have handed myself over to you. I am now entirely in your keeping.', d: 'easy' },
  { s: 'Raataan Lambiyan', m: 'Shershaah', y: 2021, a: ['Jubin Nautiyal', 'Asees Kaur'], h: 'तेरी मेरी गल्लां हो गई मशहूर', hr: 'Teri meri gallan ho gayi mashhoor', e: 'The stories of you and me have become famous everywhere.', d: 'easy' },
  { s: 'Tum Kya Mile', m: 'Rocky Aur Rani Kii Prem Kahaani', y: 2023, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'तुम क्या मिले, हम ना रहे हम', hr: 'Tum kya mile, hum na rahe hum', e: 'Since the moment I met you, I am no longer the person I used to be.', d: 'easy' },
  { s: 'Chaleya', m: 'Jawan', y: 2023, a: ['Arijit Singh', 'Shilpa Rao'], h: 'इश्क़ में दिल बना है इश्क़ में दिल फना है', hr: 'Ishq mein dil bana hai ishq mein dil fana hai', e: 'The heart is forged in love, and in love, the heart is destroyed.', d: 'easy' },
  { s: 'Ghungroo', m: 'War', y: 2019, a: ['Arijit Singh', 'Shilpa Rao'], h: 'घुँघरू टूट गए', hr: 'Ghungroo toot gaye', e: 'The dancing bells have finally broken from dancing too wildly.', d: 'easy' },
  { s: 'Shayad', m: 'Love Aaj Kal', y: 2020, a: ['Arijit Singh'], h: 'शायद कभी ना कह सकूँ मैं तुमको', hr: 'Shayad kabhi na keh sakoon main tumko', e: 'Perhaps I will never be able to say this to you out loud.', d: 'easy' },
  { s: 'Rasiya', m: 'Brahmastra', y: 2022, a: ['Tushar Joshi', 'Shreya Ghoshal'], h: 'रसिया मेरे रसिया', hr: 'Rasiya mere rasiya', e: 'My beloved, my beautiful soul.', d: 'easy' },
  { s: 'Tumse Bhi Zyada', m: 'Tadap', y: 2021, a: ['Arijit Singh'], h: 'तुमसे भी ज़्यादा तुमसे प्यार किया', hr: 'Tumse bhi zyada tumse pyaar kiya', e: 'I have loved you even more than you yourself ever could.', d: 'easy' },
  { s: 'Meri Jaan', m: 'Gangubai Kathiawadi', y: 2022, a: ['Neeti Mohan'], h: 'मेरी जान, मेरी जान', hr: 'Meri jaan, meri jaan', e: 'My life, my everything.', d: 'easy' },
  { s: 'Malang Sajna', m: 'Malang Sajna', y: 2022, a: ['Sachet Tandon', 'Parampara Tandon'], h: 'मलंग सजना, मलंग सजना', hr: 'Malang sajna, malang sajna', e: 'My carefree beloved, beautifully wild and untamed.', d: 'easy' },
  { s: 'Heeriye', m: 'Heeriye', y: 2023, a: ['Arijit Singh', 'Jasleen Royal'], h: 'हीरिये, हीरिये', hr: 'Heeriye, heeriye', e: 'Oh my precious one, my diamond.', d: 'easy' },
  { s: 'O Maahi', m: 'Dunki', y: 2023, a: ['Arijit Singh'], h: 'ओ माही ओ माही', hr: 'O maahi o maahi', e: 'Oh my love, my constant companion.', d: 'easy' },
  { s: 'Satranga', m: 'Animal', y: 2023, a: ['Arijit Singh'], h: 'सतरंगा रे सतरंगा रे', hr: 'Satranga re satranga re', e: 'Oh seven-colored one, you bring every shade of emotion to my life.', d: 'easy' },
  { s: 'Pehle Bhi Main', m: 'Animal', y: 2023, a: ['Vishal Mishra'], h: 'पहले भी मैं तुमसे मिला हूँ', hr: 'Pehle bhi main tumse mila hoon', e: 'I feel certain that I have met you before, in some other life.', d: 'easy' },
  { s: 'Hua Main', m: 'Animal', y: 2023, a: ['Raghav Chaitanya'], h: 'हुआ मैं तेरा हुआ', hr: 'Hua main tera hua', e: 'I have become yours, completely yours.', d: 'easy' },
  { s: 'Ve Kamleya', m: 'Rocky Aur Rani Kii Prem Kahaani', y: 2023, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'वे कमलेया, मेरे कमलेया', hr: 'Ve kamleya, mere kamleya', e: 'Oh my foolish heart, my wildly foolish heart.', d: 'easy' },
  { s: 'What Jhumka', m: 'Rocky Aur Rani Kii Prem Kahaani', y: 2023, a: ['Arijit Singh', 'Jonita Gandhi'], h: 'वॉट झुमका', hr: 'What jhumka', e: 'What is this earring that has caused such a stir?', d: 'easy' },
  { s: 'Lutt Putt Gaya', m: 'Dunki', y: 2023, a: ['Arijit Singh'], h: 'लुट पुट गया', hr: 'Lutt putt gaya', e: 'I have been completely ruined and robbed in your love.', d: 'easy' },
  { s: 'Tere Vaaste', m: 'Zara Hatke Zara Bachke', y: 2023, a: ['Varun Jain', 'Sachin-Jigar'], h: 'तेरे वास्ते फलक से मैं चाँद लाऊँगा', hr: 'Tere vaaste falak se main chaand launga', e: 'For your sake, I will pluck the moon right from the sky.', d: 'easy' },
  { s: 'Phir Aur Kya Chahiye', m: 'Zara Hatke Zara Bachke', y: 2023, a: ['Arijit Singh'], h: 'तू है तो मुझे फिर और क्या चाहिए', hr: 'Tu hai toh mujhe phir aur kya chahiye', e: 'If I have you, what else could I possibly need in this world?', d: 'easy' },
  { s: 'Zihaal-e-Miskin', m: 'Zihaal e Miskin', y: 2023, a: ['Vishal Mishra', 'Shreya Ghoshal'], h: 'ज़िहाल-ए-मिस्कीन मकुन तग़ाफ़ुल', hr: 'Zihaal-e-miskin makun taghaful', e: 'Do not ignore the miserable state of this poor heart.', d: 'easy' },
  { s: 'Main Nikla Gaddi Leke', m: 'Gadar 2', y: 2023, a: ['Udit Narayan'], h: 'मैं निकला गड्डी लेके', hr: 'Main nikla gaddi leke', e: 'I set out, driving my car with the wind in my face.', d: 'easy' },
  { s: 'Udd Jaa Kaale Kaava', m: 'Gadar 2', y: 2023, a: ['Udit Narayan', 'Alka Yagnik'], h: 'उड़ जा काले कावां तेरे मुँह विच खंड पावां', hr: 'Udd jaa kaale kaava tere munh vich khand paava', e: 'Fly away, black crow, and I will feed you sugar if you bring me news of my love.', d: 'easy' },
  { s: 'O Bedardeya', m: 'Tu Jhoothi Main Makkaar', y: 2023, a: ['Arijit Singh'], h: 'ओ बेदर्देया', hr: 'O bedardeya', e: 'Oh heartless one, why did you have to be so cruel?', d: 'easy' },
  { s: 'Tere Pyaar Mein', m: 'Tu Jhoothi Main Makkaar', y: 2023, a: ['Arijit Singh', 'Nikhita Gandhi'], h: 'तेरे प्यार में', hr: 'Tere pyaar mein', e: 'Lost deep inside your love.', d: 'easy' },
  { s: 'Show Me The Thumka', m: 'Tu Jhoothi Main Makkaar', y: 2023, a: ['Sunidhi Chauhan', 'Shashwat Singh'], h: 'शो मी द ठुमका', hr: 'Show me the thumka', e: 'Show me that dramatic hip-shake of yours.', d: 'easy' },
  { s: 'Jhoome Jo Pathaan', m: 'Pathaan', y: 2023, a: ['Arijit Singh', 'Sukriti Kakar'], h: 'झूमे जो पठान मेरी जान महफ़िल ही लुट जाए', hr: 'Jhoome jo pathaan meri jaan mehfil hi lut jaye', e: 'When the Pathaan dances, the entire gathering is captivated.', d: 'easy' },
  { s: 'Besharam Rang', m: 'Pathaan', y: 2023, a: ['Shilpa Rao'], h: 'बेशर्म रंग कहाँ देखा दुनिया वालों ने', hr: 'Besharam rang kahan dekha duniya walon ne', e: 'The world has never truly seen the shameless colors of my spirit.', d: 'easy' },
  { s: 'Maan Meri Jaan', m: 'Maan Meri Jaan', y: 2022, a: ['King'], h: 'मान मेरी जान', hr: 'Maan meri jaan', e: 'Listen to me, my love, my life.', d: 'easy' },
  { s: 'Tu Aake Dekhle', m: 'Tu Aake Dekhle', y: 2020, a: ['King'], h: 'तू आके देखले', hr: 'Tu aake dekhle', e: 'Just come and see for yourself the state I am in.', d: 'easy' },
  { s: 'Baarish Ban Jaana', m: 'Baarish Ban Jaana', y: 2021, a: ['Payal Dev', 'Stebin Ben'], h: 'तू बारिश बन जाना', hr: 'Tu baarish ban jaana', e: 'Become the rain for me, pouring down to wash away all the pain.', d: 'easy' },
  { s: 'Raataan Lambiyan', m: 'Shershaah', y: 2021, a: ['Jubin Nautiyal', 'Asees Kaur'], h: 'काटूँ कैसे रातां ओ सांवरे', hr: 'Kaatoon kaise raataan o saanware', e: 'How am I supposed to survive these endless nights without you?', d: 'easy' },
  { s: 'Ranjha', m: 'Shershaah', y: 2021, a: ['B Praak', 'Jasleen Royal'], h: 'चुप माही चुप है राँझा', hr: 'Chup maahi chup hai ranjha', e: 'The beloved is silent, and so is the lover. Only the air speaks.', d: 'easy' },
  { s: 'Mann Bharryaa 2.0', m: 'Shershaah', y: 2021, a: ['B Praak'], h: 'मन भरया बदल गया सारा', hr: 'Mann bharryaa badal gaya saara', e: 'Once the heart was full, everything changed so drastically.', d: 'easy' },
  { s: 'Param Sundari', m: 'Mimi', y: 2021, a: ['Shreya Ghoshal'], h: 'परम सुंदरी', hr: 'Param sundari', e: 'The ultimate, flawless beauty of the world.', d: 'easy' },
  { s: 'Nadiyon Paar', m: 'Roohi', y: 2021, a: ['Shamur', 'Rashmeet Kaur'], h: 'नदियों पार सजन दा ठाणा', hr: 'Nadiyon paar sajan da thaana', e: 'My beloved house lies across the flowing rivers.', d: 'easy' },
  { s: 'Lut Gaye', m: 'Lut Gaye', y: 2021, a: ['Jubin Nautiyal'], h: 'लुट गए हम तेरी मोहब्बत में', hr: 'Lut gaye hum teri mohabbat mein', e: 'We have been utterly destroyed in the pursuit of your love.', d: 'easy' },
  { s: 'Tum Hi Aana', m: 'Marjaavaan', y: 2019, a: ['Jubin Nautiyal'], h: 'तुम ही आना', hr: 'Tum hi aana', e: 'Only you must come back. No one else will do.', d: 'easy' },
  { s: 'Thodi Jagah', m: 'Marjaavaan', y: 2019, a: ['Arijit Singh'], h: 'थोड़ी जगह दे दे मुझे', hr: 'Thodi jagah de de mujhe', e: 'Just give me a little corner in your life to exist.', d: 'easy' },
  { s: 'Kalank Title Track', m: 'Kalank', y: 2019, a: ['Arijit Singh'], h: 'हवाओं में बहेंगे, घटाओं में रहेंगे', hr: 'Hawaon mein bahenge, ghataon mein rahenge', e: 'We will flow in the winds, we will reside in the dark clouds.', d: 'easy' },
  { s: 'First Class', m: 'Kalank', y: 2019, a: ['Arijit Singh', 'Neeti Mohan'], h: 'बाकी सब फर्स्ट क्लास है', hr: 'Baaki sab first class hai', e: 'Everything else in life is just absolutely top-notch.', d: 'easy' },
  { s: 'Ve Maahi', m: 'Kesari', y: 2019, a: ['Arijit Singh', 'Asees Kaur'], h: 'वे माही मेरा कित्थे नईं दिल लगणा', hr: 'Ve maahi mera kitthe naiyo dil lagna', e: 'Oh my love, my heart cannot find peace anywhere else but with you.', d: 'easy' },
  { s: 'Teri Mitti', m: 'Kesari', y: 2019, a: ['B Praak'], h: 'तेरी मिट्टी में मिल जावाँ', hr: 'Teri mitti mein mil jaawan', e: 'Let me be dissolved into the sacred soil of this land.', d: 'easy' },
  { s: 'Chashni', m: 'Bharat', y: 2019, a: ['Abhijeet Srivastava'], h: 'मीठी चाशनी', hr: 'Meethi chashni', e: 'Sweet as the purest sugar syrup.', d: 'easy' },
  { s: 'Dil Diyan Gallan', m: 'Tiger Zinda Hai', y: 2017, a: ['Atif Aslam'], h: 'कच्ची डोरियों, डोरियों, डोरियों से', hr: 'Kacchi doriyon, doriyon, doriyon se', e: 'With fragile threads, you tied my heart to yours.', d: 'easy' },
  { s: 'Hawayein', m: 'Jab Harry Met Sejal', y: 2017, a: ['Arijit Singh'], h: 'हवाएं, हवाएं', hr: 'Hawayein, hawayein', e: 'These winds, they whisper your name to me wherever I go.', d: 'easy' },
  { s: 'Zaalima', m: 'Raees', y: 2017, a: ['Arijit Singh', 'Harshdeep Kaur'], h: 'ओ ज़ालिमा', hr: 'O zaalima', e: 'Oh you sweet tyrant, capturing my heart without a fight.', d: 'easy' },
  { s: 'Nashe Si Chadh Gayi', m: 'Befikre', y: 2016, a: ['Arijit Singh'], h: 'नशे सी चढ़ गई ओए', hr: 'Nashe si chadh gayi oye', e: 'She has gone straight to my head, like an intoxicating drink.', d: 'easy' },
];

const mediumSongs = [
  { s: 'Kahani', m: 'Laal Singh Chaddha', y: 2022, a: ['Sonu Nigam'], h: 'कहानी', hr: 'Kahani', e: 'Is it the story driving us, or are we driving the story?', d: 'medium' },
  { s: 'Tur Kalleyan', m: 'Laal Singh Chaddha', y: 2022, a: ['Arijit Singh', 'Shadab Faridi'], h: 'तुर कल्लेयां', hr: 'Tur kalleyan', e: 'Walk alone, my friend. The path itself will become your companion.', d: 'medium' },
  { s: 'Deva Deva', m: 'Brahmastra', y: 2022, a: ['Arijit Singh', 'Jonita Gandhi'], h: 'देवा देवा', hr: 'Deva deva', e: 'Oh divine spark, awaken the magic lying dormant within me.', d: 'medium' },
  { s: 'Dariya', m: 'Baar Baar Dekho', y: 2016, a: ['Arko'], h: 'ओ दरिया मुझे नहीं जाना उस पार', hr: 'O dariya mujhe nahi jaana us paar', e: 'Oh river, I have no desire to cross over. I am perfectly happy drowning in this shore.', d: 'medium' },
  { s: 'Sau Aasmaan', m: 'Baar Baar Dekho', y: 2016, a: ['Armaan Malik', 'Neeti Mohan'], h: 'सौ आसमानों को', hr: 'Sau aasmanon ko', e: 'I could search a hundred skies, but my moon is right here on earth.', d: 'medium' },
  { s: 'Naina', m: 'Dangal', y: 2016, a: ['Arijit Singh'], h: 'नैना जो साँझे खाब देखते थे', hr: 'Naina jo saanjhe khaab dekhte the', e: 'These eyes that once dreamed together, now search for each other in the dark.', d: 'medium' },
  { s: 'Haanikaarak Bapu', m: 'Dangal', y: 2016, a: ['Sarwar Khan', 'Sartaz Barna'], h: 'बापू सेहत के लिए तू तो हानिकारक है', hr: 'Bapu sehat ke liye tu toh haanikaarak hai', e: 'Father, your strictness is hazardous to our health and happiness.', d: 'medium' },
  { s: 'Zindagi Kuch Toh Bata', m: 'Bajrangi Bhaijaan', y: 2015, a: ['Rahat Fateh Ali Khan', 'Rekha Bhardwaj'], h: 'ज़िन्दगी कुछ तो बता', hr: 'Zindagi kuch toh bata', e: 'Life, at least give me a hint about where you are taking me.', d: 'medium' },
  { s: 'Tu Jo Mila', m: 'Bajrangi Bhaijaan', y: 2015, a: ['K.K.'], h: 'तू जो मिला तो हो गया सब हासिल', hr: 'Tu jo mila toh ho gaya sab haasil', e: 'The moment I found you, I gained everything I ever wanted.', d: 'medium' },
  { s: 'Tujhe Kitna Chahne Lage', m: 'Kabir Singh', y: 2019, a: ['Arijit Singh'], h: 'तुझे कितना चाहने लगे हम', hr: 'Tujhe kitna chahne lage hum', e: 'I never realized how deeply I had fallen in love with you.', d: 'medium' },
  { s: 'Kaise Hua', m: 'Kabir Singh', y: 2019, a: ['Vishal Mishra'], h: 'कैसे हुआ', hr: 'Kaise hua', e: 'How did you become so essential to my very existence?', d: 'medium' },
  { s: 'Bekhayali', m: 'Kabir Singh', y: 2019, a: ['Sachet Tandon'], h: 'बेखयाली में भी तेरा ही खयाल आये', hr: 'Bekhayali mein bhi tera hi khayal aaye', e: 'Even in my moments of absent-mindedness, you are the only thought that arrives.', d: 'medium' },
  { s: 'Pehli Dafa', m: 'Pehli Dafa', y: 2016, a: ['Atif Aslam'], h: 'पहली दफा', hr: 'Pehli dafa', e: 'For the very first time, my heart skipped a beat for someone.', d: 'medium' },
  { s: 'Dil Meri Na Sune', m: 'Genius', y: 2018, a: ['Atif Aslam'], h: 'दिल मेरी ना सुने', hr: 'Dil meri na sune', e: 'My heart absolutely refuses to listen to reason when it comes to you.', d: 'medium' },
  { s: 'Tera Yaar Hoon Main', m: 'Sonu Ke Titu Ki Sweety', y: 2018, a: ['Arijit Singh'], h: 'तेरा यार हूँ मैं', hr: 'Tera yaar hoon main', e: 'Whatever happens, always remember that I am your friend first.', d: 'medium' },
  { s: 'Bom Diggy Diggy', m: 'Sonu Ke Titu Ki Sweety', y: 2018, a: ['Zack Knight', 'Jasmin Walia'], h: 'बोम डिग्गी डिग्गी', hr: 'Bom diggy diggy', e: 'Let the rhythm take over and shake away the worries.', d: 'medium' },
  { s: 'Dil Chori', m: 'Sonu Ke Titu Ki Sweety', y: 2018, a: ['Yo Yo Honey Singh'], h: 'दिल चोरी साड्डा हो गया', hr: 'Dil chori sadda ho gaya', e: 'My heart has been stolen right from under my nose.', d: 'medium' },
  { s: 'Binte Dil', m: 'Padmaavat', y: 2018, a: ['Arijit Singh'], h: 'बिन्ते दिल मिस्रिया में', hr: 'Binte dil misriya mein', e: 'The desires of the heart are spoken in sweet, foreign tongues.', d: 'medium' },
  { s: 'Khalibali', m: 'Padmaavat', y: 2018, a: ['Shivam Pathak', 'Shail Hada'], h: 'खलीबली हो गया है दिल', hr: 'Khalibali ho gaya hai dil', e: 'My heart has gone completely chaotic and restless.', d: 'medium' },
  { s: 'Ghoomar', m: 'Padmaavat', y: 2018, a: ['Shreya Ghoshal', 'Swaroop Khan'], h: 'घूमर', hr: 'Ghoomar', e: 'Spinning in circles, lost in the trance of tradition and beauty.', d: 'medium' },
  { s: 'Chitta', m: 'Shiddat', y: 2021, a: ['Manan Bhardwaj'], h: 'चिट्टा कुक्कड़', hr: 'Chitta kukkad', e: 'The white rooster crows, signaling the dawn of a new passion.', d: 'medium' },
  { s: 'Humsafar', m: 'Badrinath Ki Dulhania', y: 2017, a: ['Akhil Sachdeva'], h: 'हमसफ़र', hr: 'Humsafar', e: 'You are the only co-traveler I want on this journey of life.', d: 'medium' },
  { s: 'Tamma Tamma Again', m: 'Badrinath Ki Dulhania', y: 2017, a: ['Bappi Lahiri', 'Anuradha Paudwal'], h: 'तम्मा तम्मा लोगे', hr: 'Tamma tamma loge', e: 'The beat is contagious, demanding you to move your feet.', d: 'medium' },
  { s: 'Safar', m: 'Jab Harry Met Sejal', y: 2017, a: ['Arijit Singh'], h: 'सफ़र का ही था मैं, सफ़र का रहा', hr: 'Safar ka hi tha main, safar ka raha', e: 'I belonged to the journey, and to the journey I remain.', d: 'medium' },
  { s: 'Radha', m: 'Jab Harry Met Sejal', y: 2017, a: ['Sunidhi Chauhan', 'Shahid Mallya'], h: 'मैं बनी तेरी राधा', hr: 'Main bani teri radha', e: 'I have become your devoted Radha, lost in your melody.', d: 'medium' },
  { s: 'Beech Beech Mein', m: 'Jab Harry Met Sejal', y: 2017, a: ['Arijit Singh', 'Shalmali Kholgade'], h: 'बीच बीच में', hr: 'Beech beech mein', e: 'Caught somewhere in the middle of this beautiful confusion.', d: 'medium' },
  { s: 'Channa Mereya Unplugged', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Arijit Singh'], h: 'अच्छा चलता हूँ', hr: 'Achha chalta hoon', e: 'I take my leave now, with only a stripped-down acoustic goodbye.', d: 'medium' },
  { s: 'Bulleya', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Amit Mishra', 'Shilpa Rao'], h: 'बुलया की जाना मैं कौन', hr: 'Bulleya ki jaana main kaun', e: 'Oh Bulleh Shah, I have no idea who I have become anymore.', d: 'medium' },
  { s: 'The Breakup Song', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Arijit Singh', 'Jonita Gandhi'], h: 'ब्रेकअप सांग', hr: 'Breakup song', e: 'Let us celebrate the end with a song instead of tears.', d: 'medium' },
  { s: 'Haan Main Galat', m: 'Love Aaj Kal', y: 2020, a: ['Arijit Singh', 'Shashwat Singh'], h: 'हाँ मैं गलत', hr: 'Haan main galat', e: 'Yes, I am wrong, and I am perfectly fine with being wrong.', d: 'medium' },
  { s: 'Mehrama', m: 'Love Aaj Kal', y: 2020, a: ['Darshan Raval', 'Antara Mitra'], h: 'मेहरमा', hr: 'Mehrama', e: 'My confidant, my soulkeeper, where have you gone?', d: 'medium' },
  { s: 'Pal', m: 'Jalebi', y: 2018, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'पल एक पल', hr: 'Pal ek pal', e: 'Just one passing moment is enough to fall in love forever.', d: 'medium' },
  { s: 'Ik Vaari Aa', m: 'Raabta', y: 2017, a: ['Arijit Singh'], h: 'इक वारी आ भी जा यारा', hr: 'Ik vaari aa bhi ja yaara', e: 'Just come back to me one more time, my dear friend.', d: 'medium' },
  { s: 'Main Tera Boyfriend', m: 'Raabta', y: 2017, a: ['Arijit Singh', 'Neha Kakkar'], h: 'मैं तेरा बॉयफ्रेंड', hr: 'Main tera boyfriend', e: 'I am your boyfriend, why do you act so coy?', d: 'medium' },
  { s: 'Aashiq Surrender Hua', m: 'Badrinath Ki Dulhania', y: 2017, a: ['Amaal Mallik', 'Shreya Ghoshal'], h: 'आशिक सरेंडर हुआ', hr: 'Aashiq surrender hua', e: 'The lover has finally raised his hands in absolute surrender.', d: 'medium' },
  { s: 'Kar Gayi Chull', m: 'Kapoor & Sons', y: 2016, a: ['Badshah', 'Fazilpuria', 'Sukriti Kakar', 'Neha Kakkar'], h: 'लड़की ब्यूटीफुल कर गई चुल्ल', hr: 'Ladki beautiful kar gayi chull', e: 'This beautiful girl has driven me absolutely crazy with desire.', d: 'medium' },
  { s: 'Bolna', m: 'Kapoor & Sons', y: 2016, a: ['Arijit Singh', 'Asees Kaur'], h: 'बोलना माही बोलना', hr: 'Bolna maahi bolna', e: 'Speak to me, my love, please say something to break this silence.', d: 'medium' },
  { s: 'Lets Nacho', m: 'Kapoor & Sons', y: 2016, a: ['Badshah', 'Benny Dayal'], h: 'लेट्स नाचो', hr: 'Lets nacho', e: 'Let us just dance and forget everything else.', d: 'medium' },
  { s: 'Jabra Fan', m: 'Fan', y: 2016, a: ['Nakash Aziz'], h: 'मैं तेरा हाय रे जबरा फैन हो गया', hr: 'Main tera haye re jabra fan ho gaya', e: 'I have become your ultimate, unapologetic, fanatic admirer.', d: 'medium' },
  { s: 'Kala Chashma', m: 'Baar Baar Dekho', y: 2016, a: ['Amar Arshi', 'Badshah', 'Neha Kakkar'], h: 'काला चश्मा', hr: 'Kala chashma', e: 'Those dark sunglasses hide secrets in those beautiful eyes.', d: 'medium' },
  { s: 'Soch Na Sake', m: 'Airlift', y: 2016, a: ['Arijit Singh', 'Tulsi Kumar'], h: 'तू सोच ना सके', hr: 'Tu soch na sake', e: 'You cannot even begin to imagine how much I love you.', d: 'medium' },
  { s: 'Dil Cheez Tujhe Dedi', m: 'Airlift', y: 2016, a: ['Ankit Tiwari', 'Arijit Singh'], h: 'दिल चीज़ तुझे दे दी', hr: 'Dil cheez tujhe dedi', e: 'I have handed over my heart to you, no questions asked.', d: 'medium' },
  { s: 'Tera Zikr', m: 'Tera Zikr', y: 2017, a: ['Darshan Raval'], h: 'तेरा ज़िक्र', hr: 'Tera zikr', e: 'Every conversation I have eventually finds its way back to your name.', d: 'medium' },
  { s: 'Kamariya', m: 'Stree', y: 2018, a: ['Aastha Gill', 'Divya Kumar'], h: 'कमरिया', hr: 'Kamariya', e: 'That sway of your waist has completely mesmerized me.', d: 'medium' },
  { s: 'Milegi Milegi', m: 'Stree', y: 2018, a: ['Mika Singh'], h: 'मिलेगी मिलेगी', hr: 'Milegi milegi', e: 'She will meet me, she will surely meet me one day.', d: 'medium' },
  { s: 'Aao Kabhi Haveli Pe', m: 'Stree', y: 2018, a: ['Badshah', 'Nikhita Gandhi'], h: 'आओ कभी हवेली पे', hr: 'Aao kabhi haveli pe', e: 'Come visit the mansion sometime, if you dare.', d: 'medium' },
  { s: 'Sweety Tera Drama', m: 'Bareilly Ki Barfi', y: 2017, a: ['Dev Negi', 'Pawni Pandey', 'Shraddha Pandit'], h: 'स्वीटी तेरा ड्रामा', hr: 'Sweety tera drama', e: 'Your dramatic flair is simply too much to handle, darling.', d: 'medium' },
  { s: 'Nazm Nazm', m: 'Bareilly Ki Barfi', y: 2017, a: ['Arko'], h: 'नज़्म नज़्म सा मेरे', hr: 'Nazm nazm sa mere', e: 'You linger on my lips like a delicate piece of poetry.', d: 'medium' },
  { s: 'Twist Kamariya', m: 'Bareilly Ki Barfi', y: 2017, a: ['Harshdeep Kaur', 'Yasser Desai'], h: 'ट्विस्ट कमरिया', hr: 'Twist kamariya', e: 'Shake those hips and let the rhythm take control.', d: 'medium' },
  { s: 'Ullu Ka Pattha', m: 'Jagga Jasoos', y: 2017, a: ['Arijit Singh', 'Nikhita Gandhi'], h: 'उल्लू का पट्ठा', hr: 'Ullu ka pattha', e: 'This absolute fool of a heart is wandering aimlessly again.', d: 'medium' },
];

const hardSongs = [
  { s: 'Ghar More Pardesiya', m: 'Kalank', y: 2019, a: ['Shreya Ghoshal', 'Vaishali Mhade'], h: 'घर मोरे परदेसिया', hr: 'Ghar more pardesiya', e: 'My beloved wanderer has finally returned to my home.', d: 'hard' },
  { s: 'Tabaah Ho Gaye', m: 'Kalank', y: 2019, a: ['Shreya Ghoshal'], h: 'हम तबाह हो गए', hr: 'Hum tabaah ho gaye', e: 'We have been completely and utterly ruined by this love.', d: 'hard' },
  { s: 'Laal Ishq', m: 'Goliyon Ki Raasleela Ram-Leela', y: 2013, a: ['Arijit Singh'], h: 'लाल इश्क़', hr: 'Laal ishq', e: 'This love is a deep, fiery red, consuming everything in its path.', d: 'hard' },
  { s: 'Mohe Rang Do Laal', m: 'Bajirao Mastani', y: 2015, a: ['Shreya Ghoshal', 'Pandit Birju Maharaj'], h: 'मोहे रंग दो लाल', hr: 'Mohe rang do laal', e: 'Drench me completely in the color of red, the color of passion.', d: 'hard' },
  { s: 'Deewani Mastani', m: 'Bajirao Mastani', y: 2015, a: ['Shreya Ghoshal'], h: 'दीवानी मस्तानी हो गई', hr: 'Deewani mastani ho gayi', e: 'Mastani has gone completely mad, intoxicated by her love.', d: 'hard' },
  { s: 'Pinga', m: 'Bajirao Mastani', y: 2015, a: ['Shreya Ghoshal', 'Vaishali Mhade'], h: 'पिंगा ग पोरी', hr: 'Pinga ga pori', e: 'Let us dance, let us celebrate the bonds we share tonight.', d: 'hard' },
  { s: 'Lahu Munh Lag Gaya', m: 'Goliyon Ki Raasleela Ram-Leela', y: 2013, a: ['Shail Hada'], h: 'लहू मुँह लग गया', hr: 'Lahu munh lag gaya', e: 'The taste of blood has touched my lips; there is no going back now.', d: 'hard' },
  { s: 'Ang Laga De', m: 'Goliyon Ki Raasleela Ram-Leela', y: 2013, a: ['Aditi Paul', 'Shail Hada'], h: 'अंग लगा दे रे', hr: 'Ang laga de re', e: 'Hold me close, let your body touch mine, and burn away the distance.', d: 'hard' },
  { s: 'Nagada Sang Dhol', m: 'Goliyon Ki Raasleela Ram-Leela', y: 2013, a: ['Shreya Ghoshal', 'Osman Mir'], h: 'नगाड़ा संग ढोल बाजे', hr: 'Nagada sang dhol baaje', e: 'Let the heavy drums beat loud, echoing the rhythm of this rebellion.', d: 'hard' },
  { s: 'Dholi Taro Dhol Baaje', m: 'Hum Dil De Chuke Sanam', y: 1999, a: ['Kavita Krishnamurthy', 'Vinod Rathod'], h: 'ढोली तारो ढोल बाजे', hr: 'Dholi taro dhol baaje', e: 'Oh drummer, play your drum so loud that the whole world hears.', d: 'hard' },
  { s: 'Albela Sajan', m: 'Hum Dil De Chuke Sanam', y: 1999, a: ['Ustad Sultan Khan', 'Kavita Krishnamurthy', 'Shankar Mahadevan'], h: 'अलबेला सजन आयो रे', hr: 'Albela sajan aayo re', e: 'My unique, beautiful beloved has finally arrived.', d: 'hard' },
  { s: 'Nimbooda', m: 'Hum Dil De Chuke Sanam', y: 1999, a: ['Kavita Krishnamurthy', 'Karsan Sargathiya'], h: 'नींबूड़ा नींबूड़ा नींबूड़ा', hr: 'Nimbooda nimbooda nimbooda', e: 'Bring me the fresh, sour lime to ward off the evil eye from this love.', d: 'hard' },
  { s: 'Manwa Laage', m: 'Happy New Year', y: 2014, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'मनवा लागे', hr: 'Manwa laage', e: 'My heart has attached itself to you so deeply, it refuses to let go.', d: 'hard' },
  { s: 'Moh Moh Ke Dhaage', m: 'Dum Laga Ke Haisha', y: 2015, a: ['Papon', 'Monali Thakur'], h: 'मोह मोह के धागे', hr: 'Moh moh ke dhaage', e: 'These delicate threads of attachment are weaving us together.', d: 'hard' },
  { s: 'Sawaar Loon', m: 'Lootera', y: 2013, a: ['Monali Thakur'], h: 'हवा के झोंकों पे लिखी कहानियों', hr: 'Hawa ke jhonkon pe likhi kahaniyon', e: 'These stories written on the passing gusts of wind...', d: 'hard' },
  { s: 'Monta Re', m: 'Lootera', y: 2013, a: ['Swanand Kirkire', 'Amitabh Bhattacharya'], h: 'कागज़ के दो पंख लेके', hr: 'Kaagaz ke do pankh leke', e: 'Taking two fragile wings made of paper, this heart tried to fly.', d: 'hard' },
  { s: 'Zinda', m: 'Lootera', y: 2013, a: ['Amit Trivedi'], h: 'ज़िंदा हूँ यार, काफी है', hr: 'Zinda hoon yaar, kaafi hai', e: 'I am still alive, my friend. For now, that is enough.', d: 'hard' },
  { s: 'Sikandar', m: 'Sikandar', y: 2024, a: ['Arijit Singh'], h: 'सिकंदर', hr: 'Sikandar', e: 'The conqueror of the world has finally met his match in love.', d: 'hard' },
  { s: 'Jeeyein Kyun', m: 'Dum Maaro Dum', y: 2011, a: ['Papon'], h: 'जिये क्यों', hr: 'Jeeyein kyun', e: 'Without you, what is the point of even continuing to live?', d: 'hard' },
  { s: 'Kaisi Hai Yeh Rut', m: 'Dil Chahta Hai', y: 2001, a: ['Srinivas'], h: 'कैसी है ये रुत', hr: 'Kaisi hai yeh rut', e: 'What kind of strange, beautiful season is this that has arrived?', d: 'hard' },
  { s: 'Dastoor', m: 'Dastoor', y: 2024, a: ['B Praak'], h: 'दस्तूर', hr: 'Dastoor', e: 'It is the tradition of this world to break the hearts of true lovers.', d: 'hard' },
  { s: 'Katra Katra', m: 'Alone', y: 2015, a: ['Ankit Tiwari', 'Prakriti Kakar'], h: 'कतरा कतरा मैं गिरूँ', hr: 'Katra katra main girun', e: 'Drop by drop, I am falling apart, dissolving into you.', d: 'hard' },
  { s: 'Tose Naina', m: 'Mickey Virus', y: 2013, a: ['Arijit Singh'], h: 'तोसे नैना जब से मिले', hr: 'Tose naina jab se mile', e: 'Ever since my eyes met yours, nothing else has mattered.', d: 'hard' },
  { s: 'Bismil', m: 'Haider', y: 2014, a: ['Sukhwinder Singh'], h: 'बिस्मिल बिस्मिल', hr: 'Bismil bismil', e: 'The wounded bird sings its painful, tragic tale.', d: 'hard' },
  { s: 'Jhelum', m: 'Haider', y: 2014, a: ['Vishal Bhardwaj'], h: 'झेलम झेलम', hr: 'Jhelum jhelum', e: 'The Jhelum river flows red with the sorrow of its people.', d: 'hard' },
  { s: 'Aao Na', m: 'Haider', y: 2014, a: ['Vishal Dadlani'], h: 'आओ ना', hr: 'Aao na', e: 'Come to me, step into this beautiful madness we have created.', d: 'hard' },
  { s: 'Gulaabo', m: 'Shaandaar', y: 2015, a: ['Vishal Dadlani', 'Anusha Mani'], h: 'गुलाबो ज़रा इत्र गिरा दो', hr: 'Gulaabo zara itr gira do', e: 'Oh Gulaabo, spill a little perfume and intoxicate the night.', d: 'hard' },
  { s: 'Shaam Shandaar', m: 'Shaandaar', y: 2015, a: ['Amit Trivedi'], h: 'शाम शानदार', hr: 'Shaam shandaar', e: 'This evening is absolutely magnificent, full of grand promises.', d: 'hard' },
  { s: 'Pashmina', m: 'Fitoor', y: 2016, a: ['Amit Trivedi'], h: 'पश्मीना धागों के संग', hr: 'Pashmina dhaagon ke sang', e: 'Woven with the delicate threads of Pashmina, this love is soft but enduring.', d: 'hard' },
  { s: 'Haminastu', m: 'Fitoor', y: 2016, a: ['Zeb Bangash'], h: 'हमिनस्तु', hr: 'Haminastu', e: 'If there is a paradise on earth, it is this, it is this, it is this.', d: 'hard' },
  { s: 'Yeh Fitoor Mera', m: 'Fitoor', y: 2016, a: ['Arijit Singh'], h: 'ये फितूर मेरा', hr: 'Yeh fitoor mera', e: 'This deep, consuming obsession of mine will be the end of me.', d: 'hard' },
  { s: 'Tere Liye', m: 'Fitoor', y: 2016, a: ['Sunidhi Chauhan', 'Jubin Nautiyal'], h: 'तेरे लिए', hr: 'Tere liye', e: 'Everything I have done, everything I am, is solely for you.', d: 'hard' },
  { s: 'Hone Do Batiyaan', m: 'Fitoor', y: 2016, a: ['Nandini Srikar', 'Zeb Bangash'], h: 'होने दो बतियाँ', hr: 'Hone do batiyaan', e: 'Let the conversations flow freely, unfiltered and endless.', d: 'hard' },
  { s: 'Jugni', m: 'Cocktail', y: 2012, a: ['Arif Lohar', 'Harshdeep Kaur'], h: 'जुगनी', hr: 'Jugni', e: 'The female firefly dances with wild, uninhibited joy.', d: 'hard' },
  { s: 'Tumhi Ho Bandhu', m: 'Cocktail', y: 2012, a: ['Neeraj Shridhar', 'Kavita Seth'], h: 'तुम्ही हो बंधु', hr: 'Tumhi ho bandhu', e: 'You are my family, you are my friend, you are my everything.', d: 'hard' },
  { s: 'Daaru Desi', m: 'Cocktail', y: 2012, a: ['Benny Dayal', 'Shalmali Kholgade'], h: 'दारू देसी', hr: 'Daaru desi', e: 'This friendship is intoxicating, like cheap, strong country liquor.', d: 'hard' },
  { s: 'Yaariyan', m: 'Cocktail', y: 2012, a: ['Mohan Kanan', 'Shilpa Rao'], h: 'यारियाँ', hr: 'Yaariyan', e: 'Friendships built on fragile ground often break with a silent crack.', d: 'hard' },
  { s: 'Banjaara', m: 'Ek Tha Tiger', y: 2012, a: ['Sukhwinder Singh'], h: 'बंजारा', hr: 'Banjaara', e: 'The wanderer has finally found a reason to stay in one place.', d: 'hard' },
  { s: 'Saiyaara', m: 'Ek Tha Tiger', y: 2012, a: ['Mohit Chauhan', 'Taraannum Mallik'], h: 'सैयारा', hr: 'Saiyaara', e: 'Oh wandering star, guide me back to the one I love.', d: 'hard' },
  { s: 'Lapata', m: 'Ek Tha Tiger', y: 2012, a: ['K.K.', 'Palak Muchhal'], h: 'लापता', hr: 'Lapata', e: 'I am completely lost in the crowded streets of your thoughts.', d: 'hard' },
  { s: 'Jashn-E-Ishqa', m: 'Gunday', y: 2014, a: ['Javed Ali', 'Shadab Faridi'], h: 'जश्न-ए-इश्क़ा', hr: 'Jashn-e-ishqa', e: 'Let the grand celebration of our rebellious love begin.', d: 'hard' },
  { s: 'Tune Maari Entriyaan', m: 'Gunday', y: 2014, a: ['Bappi Lahiri', 'KK', 'Neeti Mohan', 'Vishal Dadlani'], h: 'तूने मारी एंट्रियां', hr: 'Tune maari entriyaan', e: 'The moment you made your entrance, bells started ringing in my heart.', d: 'hard' },
  { s: 'Jiya', m: 'Gunday', y: 2014, a: ['Arijit Singh'], h: 'जिया', hr: 'Jiya', e: 'My heart beats with a frantic, desperate rhythm for you.', d: 'hard' },
  { s: 'Asalaam-e-Ishqum', m: 'Gunday', y: 2014, a: ['Bappi Lahiri', 'Neha Bhasin'], h: 'अस्सलाम-ए-इश्कुम', hr: 'Asalaam-e-ishqum', e: 'I offer my deepest, most dangerous greetings to this love.', d: 'hard' },
  { s: 'Dhunki', m: 'Mere Brother Ki Dulhan', y: 2011, a: ['Neha Bhasin'], h: 'धुनकी', hr: 'Dhunki', e: 'I am high on this wild, untamed energy of life.', d: 'hard' },
  { s: 'Isq Risk', m: 'Mere Brother Ki Dulhan', y: 2011, a: ['Rahat Fateh Ali Khan'], h: 'इश्क़ रिस्क', hr: 'Isq risk', e: 'Love is a massive risk, but it is the only one worth taking.', d: 'hard' },
  { s: 'Choomantar', m: 'Mere Brother Ki Dulhan', y: 2011, a: ['Benny Dayal', 'Aditi Singh Sharma'], h: 'छूमंतर', hr: 'Choomantar', e: 'Disappear with me, vanish into the night like magic.', d: 'hard' },
  { s: 'Do Dhaari Talwaar', m: 'Mere Brother Ki Dulhan', y: 2011, a: ['Shweta Pandit', 'Shahid Mallya'], h: 'दो धारी तलवार', hr: 'Do dhaari talwaar', e: 'Your gaze is like a double-edged sword, cutting right through me.', d: 'hard' },
  { s: 'Ghani Bawri', m: 'Tanu Weds Manu Returns', y: 2015, a: ['Jyoti Nooran'], h: 'घणी बावरी', hr: 'Ghani bawri', e: 'I have become completely and utterly mad in your love.', d: 'hard' },
  { s: 'Banno', m: 'Tanu Weds Manu Returns', y: 2015, a: ['Brijesh Shandllya', 'Swati Sharma'], h: 'बन्नो तेरा स्वैगर', hr: 'Banno tera swagger', e: 'The bride has an undeniable, fiercely confident style about her.', d: 'hard' },
];

const allSongs = [...easySongs, ...mediumSongs, ...hardSongs];

async function run() {
  const finalSongs = [];
  for (let s of allSongs) {
    try {
      const q = s.s + " " + s.m + " original";
      const res = await fetch("https://itunes.apple.com/search?term=" + encodeURIComponent(q) + "&media=music&limit=1");
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        finalSongs.push({
          id: s.d[0] + Math.random().toString(36).substring(7),
          song_name: s.s,
          movie_name: s.m,
          year: s.y,
          artist: s.a,
          original_lyric: s.h,
          original_lyric_roman: s.hr,
          english_reinterpretation: s.e,
          difficulty: s.d,
          aliases: [s.s, s.m],
          audio_url: data.results[0].previewUrl,
          lyric_start_ms: 0,
          lyric_end_ms: 25000,
          hint: "A latest hit from " + s.m
        });
      }
    } catch(e) {
      console.error('Failed to fetch', s.s);
    }
  }

  let songsCode = fs.readFileSync('src/data/songs.ts', 'utf8');
  let mapped = finalSongs.map(s => {
    return "  {\n" +
    "    id: '" + s.id + "',\n" +
    "    song_name: " + JSON.stringify(s.song_name) + ",\n" +
    "    movie_name: " + JSON.stringify(s.movie_name) + ",\n" +
    "    year: " + s.year + ",\n" +
    "    artist: " + JSON.stringify(s.artist) + ",\n" +
    "    original_lyric: " + JSON.stringify(s.original_lyric) + ",\n" +
    "    original_lyric_roman: " + JSON.stringify(s.original_lyric_roman) + ",\n" +
    "    english_reinterpretation: " + JSON.stringify(s.english_reinterpretation) + ",\n" +
    "    difficulty: '" + s.difficulty + "',\n" +
    "    aliases: " + JSON.stringify(s.aliases) + ",\n" +
    "    audio_url: '" + s.audio_url + "',\n" +
    "    lyric_start_ms: 0,\n" +
    "    lyric_end_ms: 25000,\n" +
    "    hint: " + JSON.stringify(s.hint) + ",\n" +
    "  },";
  });
  
  const stringified = mapped.join("\\n").replace(/\\\\n/g, "\\n");

  const insertionIndex = songsCode.lastIndexOf('];');
  const newCode = songsCode.slice(0, insertionIndex) + "\\n" + stringified + "\\n" + songsCode.slice(insertionIndex);
  
  fs.writeFileSync('src/data/songs.ts', newCode.replace(/\\\\n/g, "\\n"));
  console.log("Added " + finalSongs.length + " latest songs!");
}

run();

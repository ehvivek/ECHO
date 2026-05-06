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
  { s: 'Nadiyon Paar', m: 'Roohi', y: 2021, a: ['Shamur', 'Rashmeet Kaur'], h: 'नदियों पार सजन दा ठाणा', hr: 'Nadiyon paar sajan da thaana', e: 'My beloved's home lies across the flowing rivers.', d: 'easy' },
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

async function run() {
  const finalSongs = [];
  for (let s of easySongs) {
    try {
      const q = \`\${s.s} \${s.m} original\`;
      const res = await fetch(\`https://itunes.apple.com/search?term=\${encodeURIComponent(q)}&media=music&limit=1\`);
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
          hint: \`A latest hit from \${s.m}\`
        });
      }
    } catch(e) {
      console.error('Failed to fetch', s.s);
    }
  }

  // Append to songs.ts
  let songsCode = fs.readFileSync('src/data/songs.ts', 'utf8');
  const stringified = finalSongs.map(s => {
    return \`  {
    id: '\${s.id}',
    song_name: '\${s.song_name.replace(/'/g, "\\'")}',
    movie_name: '\${s.movie_name.replace(/'/g, "\\'")}',
    year: \${s.year},
    artist: \${JSON.stringify(s.artist)},
    original_lyric: '\${s.original_lyric.replace(/'/g, "\\'")}',
    original_lyric_roman: '\${s.original_lyric_roman.replace(/'/g, "\\'")}',
    english_reinterpretation: '\${s.english_reinterpretation.replace(/'/g, "\\'")}',
    difficulty: '\${s.difficulty}',
    aliases: \${JSON.stringify(s.aliases)},
    audio_url: '\${s.audio_url}',
    lyric_start_ms: 0,
    lyric_end_ms: 25000,
    hint: '\${s.hint.replace(/'/g, "\\'")}',
  },\`;
  }).join('\
');

  const insertionIndex = songsCode.lastIndexOf('];');
  const newCode = songsCode.slice(0, insertionIndex) + '\
' + stringified + '\
' + songsCode.slice(insertionIndex);
  
  fs.writeFileSync('src/data/songs.ts', newCode);
  console.log(\`Added \${finalSongs.length} latest easy songs!\`);
}

run();

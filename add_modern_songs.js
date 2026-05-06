const fs = require('fs');

const modernSongs = [
  // EASY
  { s: 'Kesariya', m: 'Brahmastra', y: 2022, a: ['Arijit Singh'], h: 'केसरिया तेरा इश्क़ है पिया', hr: 'Kesariya tera ishq hai piya', e: 'Your love is the color of saffron, my beloved. It dyes my soul in its vibrant hue.', d: 'easy' },
  { s: 'Apna Bana Le', m: 'Bhediya', y: 2022, a: ['Arijit Singh'], h: 'अपना बना ले पिया, अपना बना ले पिया', hr: 'Apna bana le piya, apna bana le piya', e: 'Make me yours, my love. Make me entirely yours, for I have nowhere else to go.', d: 'easy' },
  { s: 'Jhoome Jo Pathaan', m: 'Pathaan', y: 2023, a: ['Arijit Singh', 'Sukriti Kakar'], h: 'झूमे जो पठान मेरी जान महफ़िल ही लुट जाए', hr: 'Jhoome jo pathaan meri jaan mehfil hi lut jaye', e: 'When the Pathaan dances, my love, the entire gathering is completely captivated.', d: 'easy' },
  { s: 'Ghungroo', m: 'War', y: 2019, a: ['Arijit Singh', 'Shilpa Rao'], h: 'घुँघरू टूट गए, घुँघरू टूट गए', hr: 'Ghungroo toot gaye, ghungroo toot gaye', e: 'The bells on my anklets broke from dancing so fiercely. I lost all my inhibitions tonight.', d: 'easy' },
  { s: 'Hawayein', m: 'Jab Harry Met Sejal', y: 2017, a: ['Arijit Singh'], h: 'ले जाएँ जाने कहाँ हवाएँ, हवाएँ', hr: 'Le jaayein jaane kahan hawayein, hawayein', e: 'Who knows where these winds are taking us? I have simply surrendered to their flow.', d: 'easy' },
  { s: 'Zaalima', m: 'Raees', y: 2017, a: ['Arijit Singh', 'Harshdeep Kaur'], h: 'ओ ज़ालिमा, जो तेरी खातिर तड़पे पहले से ही', hr: 'O zaalima, jo teri khatir tadpe pehle se hi', e: 'Oh cruel one, what is the point of tormenting a heart that is already suffering for you?', d: 'easy' },
  { s: 'Tera Ban Jaunga', m: 'Kabir Singh', y: 2019, a: ['Akhil Sachdeva', 'Tulsi Kumar'], h: 'मैं तेरा बन जाऊँगा', hr: 'Main tera ban jaunga', e: 'I will become yours. I will mold myself entirely into whoever you need me to be.', d: 'easy' },
  { s: 'Bekhayali', m: 'Kabir Singh', y: 2019, a: ['Sachet Tandon'], h: 'बेख़याली में भी तेरा ही ख़याल आये', hr: 'Bekhayali mein bhi tera hi khayaal aaye', e: 'Even in my moments of complete thoughtlessness, it is only your thought that arrives.', d: 'easy' },
  { s: 'Tere Hawaale', m: 'Laal Singh Chaddha', y: 2022, a: ['Arijit Singh', 'Shilpa Rao'], h: 'मैं तो हूँ बस तेरे हवाले', hr: 'Main toh hoon bas tere hawaale', e: 'I am now entirely in your custody. Do with me whatever you will.', d: 'easy' },
  { s: 'Dil Diyan Gallan', m: 'Tiger Zinda Hai', y: 2017, a: ['Atif Aslam'], h: 'कच्ची डोरियों, डोरियों, डोरियों से मैनू तू बाँध ले', hr: 'Kacchi doriyon, doriyon, doriyon se mainu tu baandh le', e: 'Tie me to yourself with the most fragile of threads. I promise I will never break them.', d: 'easy' },
  { s: 'Samjhawan', m: 'Humpty Sharma Ki Dulhania', y: 2014, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'मैं तेनू समझावाँ की, ना तेरे बिना लगदा जी', hr: 'Main tenu samjhawan ki, na tere bina lagda jee', e: 'How do I even begin to explain it to you? My heart simply refuses to beat without you.', d: 'easy' },
  { s: 'Sanam Re', m: 'Sanam Re', y: 2016, a: ['Arijit Singh'], h: 'भीगी भीगी सड़कों पे मैं, तेरा इंतज़ार करूँ', hr: 'Bheegi bheegi sadkon pe main, tera intezaar karun', e: 'Standing here on these rain-drenched streets, I will wait for you forever if I have to.', d: 'easy' },
  { s: 'Kala Chashma', m: 'Baar Baar Dekho', y: 2016, a: ['Amar Arshi', 'Badshah', 'Neha Kakkar'], h: 'तैनू काला चश्मा जँचदा ऐ, जँचदा ऐ गोरे मुखड़े ते', hr: 'Tenu kala chashma jachda ae, jachda ae gore mukhde te', e: 'Those dark sunglasses look absolutely stunning against your fair face.', d: 'easy' },
  { s: 'Param Sundari', m: 'Mimi', y: 2021, a: ['Shreya Ghoshal'], h: 'परम सुंदरी, परम सुंदरी', hr: 'Param sundari, param sundari', e: 'The absolute, ultimate beauty. A force of nature that cannot be ignored.', d: 'easy' },
  { s: 'Shayad', m: 'Love Aaj Kal', y: 2020, a: ['Arijit Singh'], h: 'शायद कभी ना कह सकूँ मैं तुमको', hr: 'Shayad kabhi na keh sakoon main tumko', e: 'Perhaps I will never find the courage to say it to your face, but you are all I have.', d: 'easy' },
  { s: 'Tum Se', m: 'Teri Baaton Mein Aisa Uljha Jiya', y: 2024, a: ['Sachin-Jigar', 'Raghav Chaitanya'], h: 'तुम से, तुम से ही है मेरी सब धड़कनें', hr: 'Tum se, tum se hi hai meri sab dhadkanein', e: 'From you... it is only from you that all my heartbeats draw their rhythm.', d: 'easy' },
  { s: 'O Maahi', m: 'Dunki', y: 2023, a: ['Arijit Singh'], h: 'ओ माही वे, ओ माही वे', hr: 'O maahi ve, o maahi ve', e: 'Oh my beloved... the roads are long and the shadows are deep, but I walk only toward you.', d: 'easy' },

  // MEDIUM
  { s: 'O Bedardeya', m: 'Tu Jhoothi Main Makkaar', y: 2023, a: ['Arijit Singh'], h: 'ओ बेदर्देया, यार बेदर्देया', hr: 'O bedardeya, yaar bedardeya', e: 'Oh heartless one, oh my heartless lover. You broke me without shedding a single tear.', d: 'medium' },
  { s: 'Satranga', m: 'Animal', y: 2023, a: ['Arijit Singh'], h: 'सतरंगा इश्क़ मेरा, तूने कैसा रंग दिया', hr: 'Satranga ishq mera, tune kaisa rang diya', e: 'My love had seven distinct colors, yet you painted it over with a darkness I do not recognize.', d: 'medium' },
  { s: 'Arjan Vailly', m: 'Animal', y: 2023, a: ['Bhupinder Babbal'], h: 'हो खड़े विच डांग खड़के, ओथे हो गयी लड़ाई भारी', hr: 'Ho khade vich dang khadke, othe ho gayi ladai bhaari', e: 'The sticks clashed in the arena, and a massive, fierce battle erupted. The warrior stepped into the fray.', d: 'medium' },
  { s: 'Tauba Tauba', m: 'Bad Newz', y: 2024, a: ['Karan Aujla'], h: 'तौबा तौबा, हुस्न तेरा तौबा', hr: 'Tauba tauba, husn tera tauba', e: 'Good heavens! Your beauty is so overwhelming it demands a prayer of protection.', d: 'medium' },
  { s: 'Ve Kamleya', m: 'Rocky Aur Rani Kii Prem Kahaani', y: 2023, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'वे कमलेया, मेरे कमलेया', hr: 'Ve kamleya, mere kamleya', e: 'Oh you crazy one, my foolish, beautiful crazy one. Why do you fight what is already written?', d: 'medium' },
  { s: 'Dariya', m: 'Baar Baar Dekho', y: 2016, a: ['Arko'], h: 'ओ दरिया, मुझे नहीं जाना उस पार', hr: 'O dariya, mujhe nahi jaana us paar', e: 'Oh river, I have no desire to reach the other shore. Let me simply drown in your depths.', d: 'medium' },
  { s: 'Namo Namo', m: 'Kedarnath', y: 2018, a: ['Amit Trivedi'], h: 'नमो नमो जी शंकरा', hr: 'Namo namo ji shankara', e: 'I bow to you, oh Lord Shiva. I bow to the cosmic dancer who holds the universe in his breath.', d: 'medium' },
  { s: 'Jaan Nisaar', m: 'Kedarnath', y: 2018, a: ['Arijit Singh'], h: 'जान निसार है, जान निसार, तेरे प्यार पे मेरे यार', hr: 'Jaan nisaar hai, jaan nisaar, tere pyaar pe mere yaar', e: 'My life is completely surrendered. I lay my very existence at the altar of your love, my friend.', d: 'medium' },
  { s: 'Hasi', m: 'Hamari Adhuri Kahani', y: 2015, a: ['Ami Mishra'], h: 'हाँ हँसी बन गए, हाँ नमी बन गए', hr: 'Haan hasi ban gaye, haan nami ban gaye', e: 'You became my smile, and you became the moisture in my eyes. You became everything I feel.', d: 'medium' },
  { s: 'Pachtaoge', m: 'Jaani Ve', y: 2019, a: ['Arijit Singh'], h: 'मुझे छोड़ कर जो तुम जाओगे, बड़ा पछताओगे', hr: 'Mujhe chhod kar jo tum jaoge, bada pachtaoge', e: 'If you leave me and walk away, you will regret it deeply. The guilt will follow your shadow.', d: 'medium' },
  { s: 'Roke Na Ruke Naina', m: 'Badrinath Ki Dulhania', y: 2017, a: ['Arijit Singh'], h: 'रोके ना रुके नैना, तेरी ओर है इन्हें तो रहना', hr: 'Roke na ruke naina, teri aur hai inhein toh rehna', e: 'These eyes refuse to be stopped. No matter what I do, they simply want to rest on you.', d: 'medium' },
  { s: 'Apna Time Aayega', m: 'Gully Boy', y: 2019, a: ['Ranveer Singh'], h: 'अपना टाइम आएगा, तू नंगा ही तो आया है, क्या घंटा लेकर जाएगा', hr: 'Apna time aayega, tu nanga hi toh aaya hai, kya ghanta lekar jaayega', e: 'My time will come. You entered this world naked, what the hell do you think you will take when you leave?', d: 'medium' },
  { s: 'Pehli Dafa', m: 'Pehli Dafa', y: 2016, a: ['Atif Aslam'], h: 'पहली दफ़ा है कि मुझमें तू झलका है', hr: 'Pehli dafa hai ki mujhmein tu jhalka hai', e: 'This is the very first time that your reflection is visible within me. We are becoming one.', d: 'medium' },
  { s: 'Husn', m: 'Husn', y: 2023, a: ['Anuv Jain'], h: 'देखो देखो कैसी बातें यहाँ की, हैं साथ पर हैं साथ ना भी', hr: 'Dekho dekho kaisi baatein yahan ki, hain saath par hain saath na bhi', e: 'Look at the strange irony of this place. We are sitting right next to each other, yet we are infinitely far apart.', d: 'medium' },
  { s: 'Chaleya', m: 'Jawan', y: 2023, a: ['Arijit Singh', 'Shilpa Rao'], h: 'इश्क़ में दिल बना है, इश्क़ में दिल फ़ना है', hr: 'Ishq mein dil bana hai, ishq mein dil fanaa hai', e: 'This heart was forged in the fire of love, and it is in love that it will be entirely destroyed.', d: 'medium' },

  // HARD
  { s: 'Laal Ishq', m: 'Goliyon Ki Raasleela Ram-Leela', y: 2013, a: ['Arijit Singh'], h: 'ये लाल इश्क़, ये मलाल इश्क़, ये ऐब इश्क़, ये बैर इश्क़', hr: 'Ye laal ishq, ye malaal ishq, ye aeb ishq, ye bair ishq', e: 'This crimson love, this regretful love. This flawed, resentful love that demands everything.', d: 'hard' },
  { s: 'Binte Dil', m: 'Padmaavat', y: 2018, a: ['Arijit Singh'], h: 'बिंते दिल मिसरिया में, बिंते दिल मिसरिया में', hr: 'Binte dil misriya mein, binte dil misriya mein', e: 'Oh daughter of the heart, lost in the sands of Egypt. Your allure is a devastating mirage.', d: 'hard' },
  { s: 'Alizeh', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Arijit Singh', 'Ash King', 'Shashwat Singh'], h: 'अलिज़ेह, अलिज़ेह... कुछ तो है जो नींदें कम हैं', hr: 'Alizeh, alizeh... kuch toh hai jo neendein kam hain', e: 'Alizeh... there is something unspoken between us that is keeping sleep far away from my eyes.', d: 'hard' },
  { s: 'Aaj Din Chadheya', m: 'Love Aaj Kal', y: 2009, a: ['Rahat Fateh Ali Khan'], h: 'आज दिन चढ़ेया तेरे रंग वर्गा', hr: 'Aaj din chadheya tere rang varga', e: 'Today, the sun has risen wearing the exact same color as your radiance.', d: 'hard' },
  { s: 'Haminastu', m: 'Fitoor', y: 2016, a: ['Zeb Bangash'], h: 'गर फ़िरदौस बर रूये ज़मीं अस्त, हमीं अस्तो, हमीं अस्तो, हमीं अस्त', hr: 'Gar firdaus bar rooye zameen ast, hamin asto, hamin asto, hamin ast', e: 'If there is a paradise anywhere on the face of this earth... it is here, it is here, it is here.', d: 'hard' },
  { s: 'Zinda', m: 'Lootera', y: 2013, a: ['Amit Trivedi'], h: 'ज़िन्दा हूँ यार, काफ़ी है', hr: 'Zinda hoon yaar, kaafi hai', e: 'I am still alive, my friend. And right now, that is more than enough.', d: 'hard' },
  { s: 'Monta Re', m: 'Lootera', y: 2013, a: ['Swanand Kirkire', 'Amitabh Bhattacharya'], h: 'कागज़ के दो पंख लेके, उड़ा चला जाये रे', hr: 'Kaagaz ke do pankh leke, uda chala jaye re', e: 'Taking two fragile wings of paper, this foolish heart tries to soar into the high winds.', d: 'hard' },
  { s: 'Manwa Laage', m: 'Happy New Year', y: 2014, a: ['Shreya Ghoshal', 'Arijit Singh'], h: 'मनवा लागे, ओ मनवा लागे, लागे रे सांवरे', hr: 'Manwa laage, o manwa laage, laage re saanware', e: 'My soul has fastened itself to you. Oh dark one, my heart is irreversibly tethered to yours.', d: 'hard' },
  { s: 'Bawra Mann', m: 'Jolly LLB 2', y: 2017, a: ['Jubin Nautiyal', 'Neeti Mohan'], h: 'बावरा मन राहें ताके, तरसे रे', hr: 'Bawra mann raahein taake, tarse re', e: 'This crazy, wandering mind stares down empty roads, desperately longing for a familiar footstep.', d: 'hard' },
  { s: 'Daryaa', m: 'Manmarziyaan', y: 2018, a: ['Ammy Virk', 'Shahid Mallya'], h: 'ओ मेरी जान, ओ मेरी जान... मैं तेरा हो गया', hr: 'O meri jaan, o meri jaan... main tera ho gaya', e: 'Oh my life, oh my life... I crossed the treacherous river and now I belong completely to you.', d: 'hard' },
  { s: 'Chonch Ladhiyaan', m: 'Manmarziyaan', y: 2018, a: ['Harshdeep Kaur', 'Jazimm Sharma'], h: 'चोंच लड़ियाँ, नी चोंच लड़ियाँ', hr: 'Chonch ladhiyaan, ni chonch ladhiyaan', e: 'Our eyes met and locked like birds crossing beaks. A silent, mischievous battle has begun.', d: 'hard' },
  { s: 'Qafirana', m: 'Kedarnath', y: 2018, a: ['Arijit Singh', 'Nikhita Gandhi'], h: 'इन वादियों में टकरा चुके हैं, हम से मुसाफिर यूँ तो कई', hr: 'In waadiyon mein takra chuke hain, hum se musafir yun toh kayi', e: 'Many travelers have crossed my path in these valleys. But you... you are an entirely different kind of heresy.', d: 'hard' },
  { s: 'Rehna Tu', m: 'Delhi-6', y: 2009, a: ['A.R. Rahman', 'Benny Dayal'], h: 'रहना तू, है जैसा तू... थोड़ा सा दर्द तू, थोड़ा सुकून', hr: 'Rehna tu, hai jaisa tu... thoda sa dard tu, thoda sukoon', e: 'Please remain exactly as you are. A little bit of pain, and a little bit of profound peace.', d: 'hard' },
  { s: 'Ranjha', m: 'Shershaah', y: 2021, a: ['B Praak', 'Jasleen Royal'], h: 'चुप माही चुप है राँझा, बोले कैसे वे ना जा', hr: 'Chup maahi chup hai ranjha, bole kaise ve na ja', e: 'The lover is silent, the warrior is quiet. How do I force my lips to say "please don\'t go"?', d: 'hard' },
  { s: 'Raanjhanaa', m: 'Raanjhanaa', y: 2013, a: ['Shiraz Uppal', 'Jaswinder Singh'], h: 'हुआ मैं तेरा, ओ राँझणा', hr: 'Hua main tera, o raanjhana', e: 'I have become yours. I have surrendered my very identity, oh my ultimate lover.', d: 'hard' }
];

const allSongs = modernSongs;

async function run() {
  const finalSongs = [];
  for (let s of allSongs) {
    try {
      const q = `${s.s} ${s.m} original`;
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=1`);
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
          hint: `A modern blockbuster from ${s.m}`
        });
      }
    } catch(e) {
      console.error('Failed to fetch', s.s);
    }
  }

  // Extract old songs via regex to cleanly rebuild the file
  let songsCode = fs.readFileSync('src/data/songs.ts', 'utf8');
  const songRegex = /{\s*id:\s*.[ehm].+?,[\s\S]*?hint:\s*.*?\s*}/g;
  const matches = [...songsCode.matchAll(songRegex)];
  const existingSongs = matches.map(m => m[0]);

  const stringified = finalSongs.map(s => {
    return `  {
    id: '${s.id}',
    song_name: '${s.song_name.replace(/'/g, "\\'")}',
    movie_name: '${s.movie_name.replace(/'/g, "\\'")}',
    year: ${s.year},
    artist: ${JSON.stringify(s.artist)},
    original_lyric: '${s.original_lyric.replace(/'/g, "\\'")}',
    original_lyric_roman: '${s.original_lyric_roman.replace(/'/g, "\\'")}',
    english_reinterpretation: '${s.english_reinterpretation.replace(/'/g, "\\'")}',
    difficulty: '${s.difficulty}',
    aliases: ${JSON.stringify(s.aliases)},
    audio_url: '${s.audio_url}',
    lyric_start_ms: 0,
    lyric_end_ms: 25000,
    hint: '${s.hint.replace(/'/g, "\\'")}',
  }`;
  });

  const allCombined = [...existingSongs, ...stringified].join(",\n");

  const newCode = `import { Song } from '@/types';

export const songs: Song[] = [
${allCombined}
];

export function getSongsByDifficulty(difficulty: string): Song[] {
  return songs.filter(s => s.difficulty === difficulty);
}

export function getRandomSong(difficulty: string, excludeIds: Set<string>): Song | null {
  const available = songs.filter(s => s.difficulty === difficulty && !excludeIds.has(s.id));
  if (available.length === 0) {
    // Reset — allow replays
    const all = songs.filter(s => s.difficulty === difficulty);
    if (all.length === 0) return null;
    return all[Math.floor(Math.random() * all.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}
`;
  
  fs.writeFileSync('src/data/songs.ts', newCode);
  console.log(`Added ${finalSongs.length} modern songs! Total songs: ${existingSongs.length + finalSongs.length}`);
}

run();

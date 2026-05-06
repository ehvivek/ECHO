const fs = require('fs');

const newSongs = [
  // EASY
  {
    id: 'e6', song_name: 'Pehla Nasha', movie_name: 'Jo Jeeta Wohi Sikandar', year: 1992, artist: ['Udit Narayan', 'Sadhana Sargam'],
    original_lyric: 'पहला नशा, पहला खुमार, नया प्यार है नया इंतज़ार',
    original_lyric_roman: 'Pehla nasha, pehla khumar, naya pyaar hai naya intezaar',
    english_reinterpretation: 'The first intoxication, the first lingering high. It is a new love, and a beautifully entirely new kind of waiting.',
    difficulty: 'easy', aliases: ['Pehla Nasha', 'Jo Jeeta Wohi Sikandar']
  },
  {
    id: 'e7', song_name: 'Kuch Kuch Hota Hai', movie_name: 'Kuch Kuch Hota Hai', year: 1998, artist: ['Udit Narayan', 'Alka Yagnik'],
    original_lyric: 'तुम पास आए, यूँ मुस्कुराए, तुमने ना जाने क्या सपने दिखाए',
    original_lyric_roman: 'Tum paas aaye, yun muskuraye, tumne na jaane kya sapne dikhaye',
    english_reinterpretation: 'You came close, you smiled just like that. And without even knowing, you made me see a hundred new dreams.',
    difficulty: 'easy', aliases: ['KKHH', 'Kuch Kuch Hota Hai']
  },
  {
    id: 'e8', song_name: 'Kabhi Khushi Kabhie Gham', movie_name: 'Kabhi Khushi Kabhie Gham', year: 2001, artist: ['Lata Mangeshkar'],
    original_lyric: 'कभी खुशी कभी गम, ना जुदा होंगे हम',
    original_lyric_roman: 'Kabhi khushi kabhie gham, na juda honge hum',
    english_reinterpretation: 'Sometimes there is joy, sometimes sorrow. But no matter the season, we will never truly be parted.',
    difficulty: 'easy', aliases: ['K3G', 'Kabhi Khushi Kabhie Gham']
  },
  {
    id: 'e9', song_name: 'Ye Dosti Hum Nahi Todenge', movie_name: 'Sholay', year: 1975, artist: ['Kishore Kumar', 'Manna Dey'],
    original_lyric: 'ये दोस्ती हम नहीं तोड़ेंगे, तोड़ेंगे दम मगर तेरा साथ ना छोड़ेंगे',
    original_lyric_roman: 'Ye dosti hum nahi todenge, todenge dum magar tera saath na chhodenge',
    english_reinterpretation: 'We will never shatter this bond. We might draw our final breath, but we will never let go of your hand.',
    difficulty: 'easy', aliases: ['Yeh Dosti', 'Sholay Friendship Song']
  },
  {
    id: 'e10', song_name: 'Balam Pichkari', movie_name: 'Yeh Jawaani Hai Deewani', year: 2013, artist: ['Vishal Dadlani', 'Shalmali Kholgade'],
    original_lyric: 'बलम पिचकारी जो तूने मुझे मारी, तो सीधी सादी छोरी शराबी हो गई',
    original_lyric_roman: 'Balam pichkari jo tune mujhe maari, toh seedhi saadi chhori sharaabi ho gayi',
    english_reinterpretation: 'The moment your colored water struck me, this innocent girl was instantly intoxicated.',
    difficulty: 'easy', aliases: ['Balam Pichkari', 'Holi Song YJHD']
  },
  {
    id: 'e11', song_name: 'Channa Mereya', movie_name: 'Ae Dil Hai Mushkil', year: 2016, artist: ['Arijit Singh'],
    original_lyric: 'अच्छा चलता हूँ, दुआओं में याद रखना',
    original_lyric_roman: 'Achha chalta hoon, duaon mein yaad rakhna',
    english_reinterpretation: 'Alright, I am leaving now. Please, keep me somewhere in your prayers.',
    difficulty: 'easy', aliases: ['Channa Mereya', 'Arijit Singh Sad Song']
  },
  {
    id: 'e12', song_name: 'Jai Ho', movie_name: 'Slumdog Millionaire', year: 2008, artist: ['A.R. Rahman', 'Sukhwinder Singh'],
    original_lyric: 'आजा आजा जिंद शमियाने के तले, आजा ज़रीवाले नीले आसमान के तले',
    original_lyric_roman: 'Aaja aaja jind shamiyane ke tale, aaja zariwale neele aasman ke tale',
    english_reinterpretation: 'Come, step beneath the canopy of this life. Come beneath this gold-embroidered blue sky. Let victory be yours.',
    difficulty: 'easy', aliases: ['Jai Ho', 'Slumdog Millionaire']
  },
  {
    id: 'e13', song_name: 'Gerua', movie_name: 'Dilwale', year: 2015, artist: ['Arijit Singh', 'Antara Mitra'],
    original_lyric: 'रंग दे तू मोहे गेरुआ',
    original_lyric_roman: 'Rang de tu mohe gerua',
    english_reinterpretation: 'Drench me in the color of saffron, color me in the shades of your love.',
    difficulty: 'easy', aliases: ['Gerua', 'Dilwale', 'SRK Kajol Gerua']
  },
  {
    id: 'e14', song_name: 'Mera Joota Hai Japani', movie_name: 'Shree 420', year: 1955, artist: ['Mukesh'],
    original_lyric: 'मेरा जूता है जापानी, ये पतलून इंगलिस्तानी, सर पे लाल टोपी रूसी, फिर भी दिल है हिन्दुस्तानी',
    original_lyric_roman: 'Mera joota hai japani, ye patloon inglistani, sar pe laal topi rusi, phir bhi dil hai hindustani',
    english_reinterpretation: 'My shoes are Japanese, these trousers are English. The red hat on my head is Russian, but still, this heart remains entirely Indian.',
    difficulty: 'easy', aliases: ['Mera Joota Hai Japani', 'Raj Kapoor Song']
  },
  {
    id: 'e15', song_name: 'Kajra Re', movie_name: 'Bunty Aur Babli', year: 2005, artist: ['Alisha Chinai', 'Shankar Mahadevan'],
    original_lyric: 'कजरा रे कजरा रे, तेरे कारे कारे नैना',
    original_lyric_roman: 'Kajra re kajra re, tere kaare kaare naina',
    english_reinterpretation: 'Oh those kohl-lined, kohl-lined... your deep, dark eyes. They leave me mesmerized.',
    difficulty: 'easy', aliases: ['Kajra Re', 'Aishwarya Rai Song']
  },

  // MEDIUM
  {
    id: 'm6', song_name: 'Mitwa', movie_name: 'Kabhi Alvida Naa Kehna', year: 2006, artist: ['Shafqat Amanat Ali', 'Shankar Mahadevan'],
    original_lyric: 'मितवा, कहे धड़कनें तुझसे क्या',
    original_lyric_roman: 'Mitwa, kahe dhadkane tujhse kya',
    english_reinterpretation: 'Oh my soulmate, listen. Do you hear what these racing heartbeats are trying to tell you?',
    difficulty: 'medium', aliases: ['Mitwa', 'KANK', 'Shafqat Amanat Ali']
  },
  {
    id: 'm7', song_name: 'Tujh Mein Rab Dikhta Hai', movie_name: 'Rab Ne Bana Di Jodi', year: 2008, artist: ['Roop Kumar Rathod'],
    original_lyric: 'तुझ में रब दिखता है, यारा मैं क्या करूँ',
    original_lyric_roman: 'Tujh mein rab dikhta hai, yaara main kya karoon',
    english_reinterpretation: 'I look at you and I see God. Tell me, my beloved, what else am I supposed to do but bow my head?',
    difficulty: 'medium', aliases: ['Tujh Mein Rab Dikhta Hai', 'RNBDJ']
  },
  {
    id: 'm8', song_name: 'Agar Tum Saath Ho', movie_name: 'Tamasha', year: 2015, artist: ['Arijit Singh', 'Alka Yagnik'],
    original_lyric: 'तेरी नज़रों में है तेरे सपने, तेरे सपनों में है नाराज़ी',
    original_lyric_roman: 'Teri nazron mein hai tere sapne, tere sapnon mein hai naraazi',
    english_reinterpretation: 'Your eyes hold your dreams, but within those dreams, there is only anger. Yet, if you are with me, everything else falls away.',
    difficulty: 'medium', aliases: ['Agar Tum Saath Ho', 'Tamasha', 'Arijit Alka']
  },
  {
    id: 'm9', song_name: 'O Re Piya', movie_name: 'Aaja Nachle', year: 2007, artist: ['Rahat Fateh Ali Khan'],
    original_lyric: 'ओ रे पिया हाय, ओ रे पिया',
    original_lyric_roman: 'O re piya haye, o re piya',
    english_reinterpretation: 'Oh my beloved, oh my beloved. The threads of my soul are unraveling, calling out for you.',
    difficulty: 'medium', aliases: ['O Re Piya', 'Aaja Nachle', 'Rahat Fateh Ali Khan']
  },
  {
    id: 'm10', song_name: 'Mast Magan', movie_name: '2 States', year: 2014, artist: ['Arijit Singh', 'Chinmayi'],
    original_lyric: 'मन मस्त मगन, मन मस्त मगन, बस तेरा नाम दोहराए',
    original_lyric_roman: 'Man mast magan, man mast magan, bas tera naam dohraaye',
    english_reinterpretation: 'My heart is lost in a joyful trance. It has forgotten the world and now exists only to repeat your name.',
    difficulty: 'medium', aliases: ['Mast Magan', '2 States', 'Arijit Singh']
  },
  {
    id: 'm11', song_name: 'Pehli Nazar Mein', movie_name: 'Race', year: 2008, artist: ['Atif Aslam'],
    original_lyric: 'पहली नज़र में कैसा जादू कर दिया, तेरा बन बैठा है मेरा जिया',
    original_lyric_roman: 'Pehli nazar mein kaisa jaadu kar diya, tera ban baitha hai mera jiya',
    english_reinterpretation: 'What kind of magic did you cast with that very first glance? My heart instantly gave up its freedom and became entirely yours.',
    difficulty: 'medium', aliases: ['Pehli Nazar Mein', 'Race', 'Atif Aslam']
  },
  {
    id: 'm12', song_name: 'Main Hoon Na', movie_name: 'Main Hoon Na', year: 2004, artist: ['Sonu Nigam', 'Shreya Ghoshal'],
    original_lyric: 'किसका है ये तुमको इंतज़ार, मैं हूँ ना',
    original_lyric_roman: 'Kiska hai ye tumko intezaar, main hoon na',
    english_reinterpretation: 'Who is it that you are waiting for so anxiously? Look up. I am right here, aren\'t I?',
    difficulty: 'medium', aliases: ['Main Hoon Na', 'Title Track SRK']
  },
  {
    id: 'm13', song_name: 'Kalank (Title Track)', movie_name: 'Kalank', year: 2019, artist: ['Arijit Singh'],
    original_lyric: 'कलंक नहीं, इश्क़ है काजल पिया',
    original_lyric_roman: 'Kalank nahi, ishq hai kaajal piya',
    english_reinterpretation: 'This is not a stain of disgrace, my love. This love is the dark kohl that adorns my eyes.',
    difficulty: 'medium', aliases: ['Kalank', 'Kalank Title Track']
  },
  {
    id: 'm14', song_name: 'Raabta', movie_name: 'Agent Vinod', year: 2012, artist: ['Arijit Singh', 'Shreya Ghoshal'],
    original_lyric: 'कुछ तो है तुझसे राब्ता',
    original_lyric_roman: 'Kuch toh hai tujhse raabta',
    english_reinterpretation: 'I cannot explain it, but there is some unseen, undeniable connection tying my soul to yours.',
    difficulty: 'medium', aliases: ['Raabta', 'Agent Vinod', 'Kuch Toh Hai Tujhse Raabta']
  },
  {
    id: 'm15', song_name: 'Tere Mast Mast Do Nain', movie_name: 'Dabangg', year: 2010, artist: ['Rahat Fateh Ali Khan'],
    original_lyric: 'तेरे मस्त मस्त दो नैन, मेरे दिल का ले गए चैन',
    original_lyric_roman: 'Tere mast mast do nain, mere dil ka le gaye chain',
    english_reinterpretation: 'Those two intoxicating eyes of yours... they have effortlessly stolen every ounce of peace from my heart.',
    difficulty: 'medium', aliases: ['Tere Mast Mast Do Nain', 'Dabangg']
  },

  // HARD
  {
    id: 'h6', song_name: 'Phir Le Aya Dil', movie_name: 'Barfi!', year: 2012, artist: ['Arijit Singh', 'Rekha Bhardwaj'],
    original_lyric: 'फिर ले आया दिल मजबूर क्या कीजे',
    original_lyric_roman: 'Phir le aaya dil majboor kya kije',
    english_reinterpretation: 'My helpless heart has dragged me right back to this very spot. Tell me, what am I supposed to do now?',
    difficulty: 'hard', aliases: ['Phir Le Aya Dil', 'Barfi']
  },
  {
    id: 'h7', song_name: 'Safarnama', movie_name: 'Tamasha', year: 2015, artist: ['Lucky Ali'],
    original_lyric: 'ओ, सफ़रनामा, सवालों का सफ़रनामा',
    original_lyric_roman: 'O, safarnama, sawaalon ka safarnama',
    english_reinterpretation: 'Ah, this travelogue. It is nothing but a travelogue written entirely out of unanswered questions.',
    difficulty: 'hard', aliases: ['Safarnama', 'Tamasha', 'Lucky Ali']
  },
  {
    id: 'h8', song_name: 'Nadaan Parindey', movie_name: 'Rockstar', year: 2011, artist: ['A.R. Rahman', 'Mohit Chauhan'],
    original_lyric: 'नादान परिंदे घर आजा',
    original_lyric_roman: 'Nadaan parindey ghar aaja',
    english_reinterpretation: 'Oh innocent, foolish bird. The sky is too dark now. Come back home to your branch.',
    difficulty: 'hard', aliases: ['Nadaan Parindey', 'Rockstar']
  },
  {
    id: 'h9', song_name: 'Yeh Jo Des Hai Tera', movie_name: 'Swades', year: 2004, artist: ['A.R. Rahman'],
    original_lyric: 'ये जो देस है तेरा, स्वदेस है तेरा, तुझे है पुकारा',
    original_lyric_roman: 'Yeh jo des hai tera, swades hai tera, tujhe hai pukaara',
    english_reinterpretation: 'This land which is yours, this homeland of yours... it has finally called out your name.',
    difficulty: 'hard', aliases: ['Yeh Jo Des Hai Tera', 'Swades']
  },
  {
    id: 'h10', song_name: 'Aayat', movie_name: 'Bajirao Mastani', year: 2015, artist: ['Arijit Singh'],
    original_lyric: 'तुझे याद कर लिया है आयत की तरह',
    original_lyric_roman: 'Tujhe yaad kar liya hai aayat ki tarah',
    english_reinterpretation: 'I have memorized you. I have learned you by heart the way one memorizes a holy verse.',
    difficulty: 'hard', aliases: ['Aayat', 'Bajirao Mastani']
  },
  {
    id: 'h11', song_name: 'Tu Kisi Rail Si', movie_name: 'Masaan', year: 2015, artist: ['Indian Ocean', 'Swanand Kirkire'],
    original_lyric: 'तू किसी रेल सी गुज़रती है, मैं किसी पुल सा थरथराता हूँ',
    original_lyric_roman: 'Tu kisi rail si guzarti hai, main kisi pul sa thartharata hoon',
    english_reinterpretation: 'You pass by me with the speed and force of a rushing train, and I am left trembling like the bridge beneath it.',
    difficulty: 'hard', aliases: ['Tu Kisi Rail Si', 'Masaan']
  },
  {
    id: 'h12', song_name: 'Khaabon Ke Parinday', movie_name: 'Zindagi Na Milegi Dobara', year: 2011, artist: ['Alyssa Mendonsa', 'Mohit Chauhan'],
    original_lyric: 'उड़े, खुले आसमान में ख्व़ाबों के परिंदे',
    original_lyric_roman: 'Udey, khule aasman mein khwaabon ke parindey',
    english_reinterpretation: 'Look at them fly. The birds of our dreams are finally gliding through the vast, open sky.',
    difficulty: 'hard', aliases: ['Khaabon Ke Parinday', 'ZNMD']
  },
  {
    id: 'h13', song_name: 'Der Lagi Lekin', movie_name: 'Zindagi Na Milegi Dobara', year: 2011, artist: ['Shankar Mahadevan'],
    original_lyric: 'देर लगी लेकिन मैंने अब है जीना सीख लिया',
    original_lyric_roman: 'Der lagi lekin maine ab hai jeena seekh liya',
    english_reinterpretation: 'It took me a long, long time. But finally, I have learned how to actually live.',
    difficulty: 'hard', aliases: ['Der Lagi Lekin', 'ZNMD']
  },
  {
    id: 'h14', song_name: 'O Saathi Re', movie_name: 'Omkara', year: 2006, artist: ['Shreya Ghoshal', 'Vishal Bhardwaj'],
    original_lyric: 'ओ साथी रे, दिन डूबे ना',
    original_lyric_roman: 'O saathi re, din doobe na',
    english_reinterpretation: 'Oh my companion... let this day stretch on forever. Let the sun never set on us.',
    difficulty: 'hard', aliases: ['O Saathi Re', 'Omkara']
  },
  {
    id: 'h15', song_name: 'Maula Mere Maula', movie_name: 'Anwar', year: 2007, artist: ['Roop Kumar Rathod'],
    original_lyric: 'मौला मेरे मौला, आँखें तेरी कितनी हसीं, कि इनका आशिक मैं बन गया हूँ',
    original_lyric_roman: 'Maula mere maula, aankhein teri kitni haseen, ki inka aashiq main ban gaya hoon',
    english_reinterpretation: 'Oh Lord, my Lord. Her eyes are so incredibly beautiful, that my soul had no choice but to become their devotee.',
    difficulty: 'hard', aliases: ['Maula Mere Maula', 'Anwar']
  }
];

async function run() {
  const finalSongs = [];
  for (let s of newSongs) {
    try {
      const q = `${s.song_name} ${s.movie_name}`;
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=1`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        s.audio_url = data.results[0].previewUrl;
        s.lyric_start_ms = 0;
        s.lyric_end_ms = 25000;
        finalSongs.push(s);
      }
    } catch(e) {
      console.error(e);
    }
  }

  // Read existing
  let songsCode = fs.readFileSync('src/data/songs.ts', 'utf8');
  
  // Create code strings
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
    hint: 'A masterpiece from ${s.movie_name.replace(/'/g, "\\'")}',
  },`;
  }).join('\n');

  // Insert before the closing bracket of the songs array
  const insertionIndex = songsCode.lastIndexOf('];');
  const newCode = songsCode.slice(0, insertionIndex) + '\n' + stringified + '\n' + songsCode.slice(insertionIndex);
  
  fs.writeFileSync('src/data/songs.ts', newCode);
  console.log(`Added ${finalSongs.length} new songs!`);
}

run();

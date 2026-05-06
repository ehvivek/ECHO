const fs = require('fs');

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

async function run() {
  const finalSongs = [];
  for (let s of hardSongs) {
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
  console.log(\`Added \${finalSongs.length} latest hard songs!\`);
}

run();

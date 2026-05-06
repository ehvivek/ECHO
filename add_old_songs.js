const fs = require('fs');

const easySongs = [
  { s: 'Lag Ja Gale', m: 'Woh Kaun Thi', y: 1964, a: ['Lata Mangeshkar'], h: 'लग जा गले कि फिर ये हसीं रात हो ना हो', hr: 'Lag ja gale ki phir ye haseen raat ho na ho', e: 'Embrace me closely, for this beautiful night may never come again.', d: 'easy' },
  { s: 'Pal Pal Dil Ke Paas', m: 'Blackmail', y: 1973, a: ['Kishore Kumar'], h: 'पल पल दिल के पास तुम रहती हो', hr: 'Pal pal dil ke paas tum rehti ho', e: 'Every single moment, you reside right here, intimately close to my heart.', d: 'easy' },
  { s: 'Kabhi Kabhie Mere Dil Mein', m: 'Kabhi Kabhie', y: 1976, a: ['Mukesh'], h: 'कभी कभी मेरे दिल में ख़याल आता है', hr: 'Kabhi kabhie mere dil mein khayaal aata hai', e: 'Sometimes, this quiet thought drifts into my heart, that you were created entirely for me.', d: 'easy' },
  { s: 'Kya Hua Tera Wada', m: 'Hum Kisise Kum Naheen', y: 1977, a: ['Mohd Rafi'], h: 'क्या हुआ तेरा वादा, वो कसम वो इरादा', hr: 'Kya hua tera wada, wo kasam wo irada', e: 'What happened to your promise? That sacred vow, that firm intention... where did it all go?', d: 'easy' },
  { s: 'Chura Liya Hai Tumne', m: 'Yaadon Ki Baaraat', y: 1973, a: ['Asha Bhosle', 'Mohd Rafi'], h: 'चुरा लिया है तुमने जो दिल को', hr: 'Chura liya hai tumne jo dil ko', e: 'Now that you have stolen my heart, please, do not steal away my gaze too.', d: 'easy' },
  { s: 'Mere Sapno Ki Rani', m: 'Aradhana', y: 1969, a: ['Kishore Kumar'], h: 'मेरे सपनों की रानी कब आयेगी तू', hr: 'Mere sapno ki rani kab aayegi tu', e: 'Oh queen of my dreams, when will you finally arrive? This life is passing by.', d: 'easy' },
  { s: 'Roop Tera Mastana', m: 'Aradhana', y: 1969, a: ['Kishore Kumar'], h: 'रूप तेरा मस्ताना, प्यार मेरा दीवाना', hr: 'Roop tera mastana, pyaar mera deewana', e: 'Your beauty is intoxicating, and my love is completely mad. We might just make a mistake tonight.', d: 'easy' },
  { s: 'Gulabi Aankhen', m: 'The Train', y: 1970, a: ['Mohd Rafi'], h: 'गुलाबी आँखें जो तेरी देखीं, शराबी ये दिल हो गया', hr: 'Gulabi aankhen jo teri dekhi, sharaabi ye dil ho gaya', e: 'The moment I saw those rose-tinted eyes of yours, this heart of mine became blissfully drunk.', d: 'easy' },
  { s: 'Yeh Raaten Yeh Mausam', m: 'Dilli Ka Thug', y: 1958, a: ['Kishore Kumar', 'Asha Bhosle'], h: 'ये रातें, ये मौसम, नदी का किनारा, ये चंचल हवा', hr: 'Yeh raaten, yeh mausam, nadi ka kinara, yeh chanchal hawa', e: 'These nights, this weather, the riverbank, and this playful breeze... everything feels like magic.', d: 'easy' },
  { s: 'O Mere Dil Ke Chain', m: 'Mere Jeevan Saathi', y: 1972, a: ['Kishore Kumar'], h: 'ओ मेरे दिल के चैन, चैन आये मेरे दिल को दुआ कीजिये', hr: 'O mere dil ke chain, chain aaye mere dil ko dua kijiye', e: 'Oh, the peace of my heart. Please pray that this restless heart finally finds some solace.', d: 'easy' },
  { s: 'Ajeeb Dastan Hai Yeh', m: 'Dil Apna Aur Preet Parai', y: 1960, a: ['Lata Mangeshkar'], h: 'अजीब दास्ताँ है ये, कहाँ शुरू कहाँ खतम', hr: 'Ajeeb dastan hai yeh, kahan shuru kahan khatam', e: 'What a strange story this is. Where does it begin, and where does it end? No one knows the destination.', d: 'easy' },
  { s: 'Ek Ajnabee Haseena Se', m: 'Ajnabee', y: 1974, a: ['Kishore Kumar'], h: 'एक अजनबी हसीना से यूँ मुलाकात हो गई', hr: 'Ek ajnabee haseena se yun mulaqat ho gayi', e: 'I met a beautiful stranger just like that, and something inexplicable blossomed between us.', d: 'easy' },
  { s: 'Chaudhvin Ka Chand Ho', m: 'Chaudhvin Ka Chand', y: 1960, a: ['Mohd Rafi'], h: 'चौदहवीं का चाँद हो, या आफ़ताब हो', hr: 'Chaudhvin ka chand ho, ya aaftaab ho', e: 'Are you the full moon of the fourteenth night, or are you the radiant sun itself? Whatever you are, you are unearthly.', d: 'easy' },
  { s: 'Pyar Deewana Hota Hai', m: 'Kati Patang', y: 1970, a: ['Kishore Kumar'], h: 'प्यार दीवाना होता है, मस्ताना होता है', hr: 'Pyar deewana hota hai, mastana hota hai', e: 'Love is a madness, an intoxication. It finds joy in every sorrow.', d: 'easy' },
  { s: 'Bheegi Bheegi Raaton Mein', m: 'Ajanabee', y: 1974, a: ['Kishore Kumar', 'Lata Mangeshkar'], h: 'भीगी भीगी रातों में, मीठी मीठी बातों में', hr: 'Bheegi bheegi raaton mein, meethi meethi baaton mein', e: 'In these drenched nights, amidst these sweet conversations... such a deep longing awakens.', d: 'easy' },
  { s: 'Dekha Ek Khwab', m: 'Silsila', y: 1981, a: ['Kishore Kumar', 'Lata Mangeshkar'], h: 'देखा एक ख़्वाब तो ये सिलसिले हुए', hr: 'Dekha ek khwab toh ye silsile hue', e: 'I saw a dream, and a whole series of beautiful events unfolded. Now every flower blooms just for you.', d: 'easy' },
  { s: 'Aap Ki Nazron Ne Samjha', m: 'Anpadh', y: 1962, a: ['Lata Mangeshkar'], h: 'आप की नज़रों ने समझा, प्यार के काबिल मुझे', hr: 'Aap ki nazron ne samjha, pyaar ke kaabil mujhe', e: 'Your gaze deemed me worthy of love. My heart is finally at peace; I have found my destination.', d: 'easy' },
  { s: 'Likhe Jo Khat Tujhe', m: 'Kanyadaan', y: 1968, a: ['Mohd Rafi'], h: 'लिखे जो खत तुझे, वो तेरी याद में', hr: 'Likhe jo khat tujhe, wo teri yaad mein', e: 'The letters I wrote to you in your memory... the morning turned them into blooming stars.', d: 'easy' },
  { s: 'Suhana Safar', m: 'Madhumati', y: 1958, a: ['Mukesh'], h: 'सुहाना सफ़र और ये मौसम हसीं', hr: 'Suhana safar aur ye mausam haseen', e: 'Such a pleasant journey, and this beautiful weather... I fear I might lose my way.', d: 'easy' },
  { s: 'Wada Karo', m: 'Aa Gale Lag Jaa', y: 1973, a: ['Kishore Kumar', 'Lata Mangeshkar'], h: 'वादा करो नहीं छोड़ोगे तुम मेरा साथ', hr: 'Wada karo nahi chhodoge tum mera saath', e: 'Promise me that you will never let go of my hand, no matter what happens.', d: 'easy' },
];

const mediumSongs = [
  { s: 'Tere Bina Zindagi Se', m: 'Aandhi', y: 1975, a: ['Kishore Kumar', 'Lata Mangeshkar'], h: 'तेरे बिना ज़िन्दगी से कोई, शिकवा तो नहीं', hr: 'Tere bina zindagi se koi, shikwa toh nahi', e: 'I have no real complaints with a life lived without you. And yet, without you, it doesn\'t feel like life at all.', d: 'medium' },
  { s: 'Tum Pukar Lo', m: 'Khamoshi', y: 1969, a: ['Hemant Kumar'], h: 'तुम पुकार लो, तुम्हारा इंतज़ार है', hr: 'Tum pukar lo, tumhara intezaar hai', e: 'Just call out my name once. I have been waiting for your voice for so long.', d: 'medium' },
  { s: 'Abhi Na Jao Chhod Kar', m: 'Hum Dono', y: 1961, a: ['Mohd Rafi', 'Asha Bhosle'], h: 'अभी ना जाओ छोड़ कर, कि दिल अभी भरा नहीं', hr: 'Abhi na jao chhod kar, ki dil abhi bhara nahi', e: 'Please, do not leave just yet. This heart is not yet full of you.', d: 'medium' },
  { s: 'Yeh Kahan Aa Gaye Hum', m: 'Silsila', y: 1981, a: ['Lata Mangeshkar', 'Amitabh Bachchan'], h: 'ये कहाँ आ गए हम, यूँही साथ साथ चलते', hr: 'Yeh kahan aa gaye hum, yunhi saath saath chalte', e: 'Where have we arrived, just walking effortlessly side by side? The paths have melted into poetry.', d: 'medium' },
  { s: 'Tujhse Naraz Nahin Zindagi', m: 'Masoom', y: 1983, a: ['Anoop Ghoshal', 'Lata Mangeshkar'], h: 'तुझसे नाराज़ नहीं ज़िन्दगी, हैरान हूँ मैं', hr: 'Tujhse naraz nahin zindagi, hairan hoon main', e: 'I am not angry with you, life. I am just... deeply bewildered by your ways.', d: 'medium' },
  { s: 'Kahin Door Jab Din Dhal Jaye', m: 'Anand', y: 1971, a: ['Mukesh'], h: 'कहीं दूर जब दिन ढल जाए, साँझ की दुल्हन बदन चुराए', hr: 'Kahin door jab din dhal jaye, saanjh ki dulhan badan churaye', e: 'Somewhere far away, when the day fades and the evening bride quietly slips in, old memories awaken.', d: 'medium' },
  { s: 'Chingari Koi Bhadke', m: 'Amar Prem', y: 1972, a: ['Kishore Kumar'], h: 'चिंगारी कोई भड़के, तो सावन उसे बुझाये', hr: 'Chingari koi bhadke, toh saawan use bujhaye', e: 'If a spark ignites, the monsoon rain can douse it. But what if the rain itself starts the fire?', d: 'medium' },
  { s: 'Zindagi Kaisi Hai Paheli', m: 'Anand', y: 1971, a: ['Manna Dey'], h: 'ज़िन्दगी कैसी है पहेली हाय, कभी तो हँसाये, कभी ये रुलाये', hr: 'Zindagi kaisi hai paheli haye, kabhi toh hasaye, kabhi ye rulaye', e: 'What a strange riddle this life is. One moment it makes you laugh, the very next, it brings tears.', d: 'medium' },
  { s: 'Aanewala Pal', m: 'Gol Maal', y: 1979, a: ['Kishore Kumar'], h: 'आनेवाला पल जानेवाला है, हो सके तो इसमें ज़िन्दगी बितादो', hr: 'Aanewala pal jaanewala hai, ho sake toh ismein zindagi bitado', e: 'The moment that is arriving is already preparing to leave. If you can, live your entire life within it.', d: 'medium' },
  { s: 'Main Zindagi Ka Saath', m: 'Hum Dono', y: 1961, a: ['Mohd Rafi'], h: 'मैं ज़िन्दगी का साथ निभाता चला गया, हर फ़िक्र को धुएँ में उड़ाता चला गया', hr: 'Main zindagi ka saath nibhata chala gaya, har fikr ko dhuen mein udata chala gaya', e: 'I simply kept walking alongside life. I blew away every worry in a puff of smoke.', d: 'medium' },
  { s: 'Yeh Jo Mohabbat Hai', m: 'Kati Patang', y: 1970, a: ['Kishore Kumar'], h: 'ये जो मोहब्बत है, ये उनका है काम', hr: 'Yeh jo mohabbat hai, yeh unka hai kaam', e: 'This thing called love... it is only meant for those who are brave enough to lose themselves.', d: 'medium' },
  { s: 'Naam Gum Jayega', m: 'Kinara', y: 1977, a: ['Lata Mangeshkar', 'Bhupinder Singh'], h: 'नाम गुम जाएगा, चेहरा ये बदल जाएगा', hr: 'Naam gum jayega, chehra ye badal jayega', e: 'The name will fade, the face will change. But if you search carefully, my voice will remain my identity.', d: 'medium' },
  { s: 'Hothon Se Chhu Lo Tum', m: 'Prem Geet', y: 1981, a: ['Jagjit Singh'], h: 'होठों से छू लो तुम, मेरा गीत अमर कर दो', hr: 'Hothon se chhu lo tum, mera geet amar kar do', e: 'Touch it with your lips, and make my song immortal. Become the melody to my restless life.', d: 'medium' },
  { s: 'Mera Kuchh Saamaan', m: 'Ijaazat', y: 1987, a: ['Asha Bhosle'], h: 'मेरा कुछ सामान, तुम्हारे पास पड़ा है', hr: 'Mera kuchh saamaan, tumhare paas pada hai', e: 'Some of my belongings are still lying with you. A damp monsoon, an unfinished complaint... please return them.', d: 'medium' },
  { s: 'Yeh Hai Bombay Meri Jaan', m: 'CID', y: 1956, a: ['Mohd Rafi', 'Geeta Dutt'], h: 'ऐ दिल है मुश्किल जीना यहाँ, ज़रा हट के ज़रा बच के', hr: 'Ae dil hai mushkil jeena yahan, zara hat ke zara bach ke', e: 'Oh heart, it is so difficult to survive here. Dodge and duck, for this is Bombay, my love.', d: 'medium' },
];

const hardSongs = [
  { s: 'Badi Sooni Sooni Hai', m: 'Mili', y: 1975, a: ['Kishore Kumar'], h: 'बड़ी सूनी सूनी है, ज़िन्दगी ये ज़िन्दगी', hr: 'Badi sooni sooni hai, zindagi ye zindagi', e: 'So terribly empty, so barren... this life, my life. I search the silence for a familiar voice.', d: 'hard' },
  { s: 'Seene Mein Jalan', m: 'Gaman', y: 1978, a: ['Suresh Wadkar'], h: 'सीने में जलन आँखों में तूफ़ान सा क्यों है', hr: 'Seene mein jalan aankhon mein toofan sa kyon hai', e: 'A burning in the chest, a storm in the eyes. Why is everyone in this city looking so troubled?', d: 'hard' },
  { s: 'Karoge Yaad Toh', m: 'Bazaar', y: 1982, a: ['Bhupinder Singh'], h: 'करोगे याद तो हर बात याद आएगी', hr: 'Karoge yaad toh har baat yaad aayegi', e: 'If you ever try to remember, every single detail will flood back. But by then, I will be out of reach.', d: 'hard' },
  { s: 'Koi Yeh Kaise Bataye', m: 'Arth', y: 1982, a: ['Jagjit Singh'], h: 'कोई ये कैसे बताये कि वो तन्हा क्यों है', hr: 'Koi yeh kaise bataye ki wo tanha kyon hai', e: 'How does someone even begin to explain why they are so lonely? Why does the crowd feel so isolating?', d: 'hard' },
  { s: 'Tum Itna Jo Muskurarahe Ho', m: 'Arth', y: 1982, a: ['Jagjit Singh'], h: 'तुम इतना जो मुस्कुरा रहे हो, क्या ग़म है जिसको छुपा रहे हो', hr: 'Tum itna jo muskura rahe ho, kya gham hai jisko chhupa rahe ho', e: 'You are smiling so much, so brightly. Tell me, what deep sorrow are you trying so hard to hide?', d: 'hard' },
  { s: 'Waqt Ne Kiya Kya Haseen Sitam', m: 'Kaagaz Ke Phool', y: 1959, a: ['Geeta Dutt'], h: 'वक़्त ने किया क्या हसीं सितम, तुम रहे ना तुम हम रहे ना हम', hr: 'Waqt ne kiya kya haseen sitam, tum rahe na tum hum rahe na hum', e: 'What a beautiful cruelty time has inflicted upon us. You are no longer you, and I am no longer me.', d: 'hard' },
  { s: 'Aap Ki Yaad Aati Rahi', m: 'Gaman', y: 1978, a: ['Chhaya Ganguly'], h: 'आप की याद आती रही रात भर', hr: 'Aap ki yaad aati rahi raat bhar', e: 'Your memory kept visiting me all through the night. A quiet, persistent guest in the dark.', d: 'hard' },
  { s: 'Kabhi Kisi Ko Mukammal', m: 'Ahista Ahista', y: 1981, a: ['Bhupinder Singh'], h: 'कभी किसी को मुकम्मल जहाँ नहीं मिलता', hr: 'Kabhi kisi ko mukammal jahan nahi milta', e: 'No one ever gets the complete world. Some miss out on the earth, some are denied the sky.', d: 'hard' },
  { s: 'Dikhayi Diye Yun', m: 'Bazaar', y: 1982, a: ['Lata Mangeshkar'], h: 'दिखाई दिए यूँ कि बेख़ुद किया', hr: 'Dikhayi diye yun ki bekhud kiya', e: 'You appeared before me, and I lost all sense of myself. The entire universe shrank down to your silhouette.', d: 'hard' },
  { s: 'Phir ChhiDi Raat', m: 'Bazaar', y: 1982, a: ['Lata Mangeshkar', 'Talat Aziz'], h: 'फिर छिड़ी रात, बात फूलों की', hr: 'Phir chhidi raat, baat phoolon ki', e: 'Once again, the night began, and conversations bloomed like flowers. But beneath the petals lay the same old ache.', d: 'hard' },
];

const allSongs = [...easySongs, ...mediumSongs, ...hardSongs];

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
          hint: `A timeless classic from ${s.m}`
        });
      }
    } catch(e) {
      console.error('Failed to fetch', s.s);
    }
  }

  // Append to songs.ts
  let songsCode = fs.readFileSync('src/data/songs.ts', 'utf8');
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
  },`;
  }).join('\n');

  const insertionIndex = songsCode.lastIndexOf('];');
  const newCode = songsCode.slice(0, insertionIndex) + '\n' + stringified + '\n' + songsCode.slice(insertionIndex);
  
  fs.writeFileSync('src/data/songs.ts', newCode);
  console.log(`Added ${finalSongs.length} classic old songs!`);
}

run();

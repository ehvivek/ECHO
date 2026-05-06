const fs = require('fs');

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
  { s: 'The Breakup Song', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Arijit Singh', 'Jonita Gandhi'], h: 'ब्रेकअप सांग', hr: 'Breakup song', e: 'Let's celebrate the end with a song instead of tears.', d: 'medium' },
  { s: 'Haan Main Galat', m: 'Love Aaj Kal', y: 2020, a: ['Arijit Singh', 'Shashwat Singh'], h: 'हाँ मैं गलत', hr: 'Haan main galat', e: 'Yes, I am wrong, and I am perfectly fine with being wrong.', d: 'medium' },
  { s: 'Mehrama', m: 'Love Aaj Kal', y: 2020, a: ['Darshan Raval', 'Antara Mitra'], h: 'मेहरमा', hr: 'Mehrama', e: 'My confidant, my soulkeeper, where have you gone?', d: 'medium' },
  { s: 'Pal', m: 'Jalebi', y: 2018, a: ['Arijit Singh', 'Shreya Ghoshal'], h: 'पल एक पल', hr: 'Pal ek pal', e: 'Just one passing moment is enough to fall in love forever.', d: 'medium' },
  { s: 'Ik Vaari Aa', m: 'Raabta', y: 2017, a: ['Arijit Singh'], h: 'इक वारी आ भी जा यारा', hr: 'Ik vaari aa bhi ja yaara', e: 'Just come back to me one more time, my dear friend.', d: 'medium' },
  { s: 'Main Tera Boyfriend', m: 'Raabta', y: 2017, a: ['Arijit Singh', 'Neha Kakkar'], h: 'मैं तेरा बॉयफ्रेंड', hr: 'Main tera boyfriend', e: 'I am your boyfriend, why do you act so coy?', d: 'medium' },
  { s: 'Aashiq Surrender Hua', m: 'Badrinath Ki Dulhania', y: 2017, a: ['Amaal Mallik', 'Shreya Ghoshal'], h: 'आशिक सरेंडर हुआ', hr: 'Aashiq surrender hua', e: 'The lover has finally raised his hands in absolute surrender.', d: 'medium' },
  { s: 'Kar Gayi Chull', m: 'Kapoor & Sons', y: 2016, a: ['Badshah', 'Fazilpuria', 'Sukriti Kakar', 'Neha Kakkar'], h: 'लड़की ब्यूटीफुल कर गई चुल्ल', hr: 'Ladki beautiful kar gayi chull', e: 'This beautiful girl has driven me absolutely crazy with desire.', d: 'medium' },
  { s: 'Bolna', m: 'Kapoor & Sons', y: 2016, a: ['Arijit Singh', 'Asees Kaur'], h: 'बोलना माही बोलना', hr: 'Bolna maahi bolna', e: 'Speak to me, my love, please say something to break this silence.', d: 'medium' },
  { s: 'Lets Nacho', m: 'Kapoor & Sons', y: 2016, a: ['Badshah', 'Benny Dayal'], h: 'लेट्स नाचो', hr: 'Lets nacho', e: 'Let's just dance and forget everything else.', d: 'medium' },
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

async function run() {
  const finalSongs = [];
  for (let s of mediumSongs) {
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
  console.log(\`Added \${finalSongs.length} latest medium songs!\`);
}

run();

const fs = require('fs');

const extraSongs = [
  // EASY (Popular, Mega Hits, Party)
  { s: 'Dil Deewana', m: 'Maine Pyar Kiya', y: 1989, a: ['Lata Mangeshkar'], h: 'दिल दीवाना, बिन सजना के माने ना', hr: 'Dil deewana, bin sajna ke maane na', e: 'This crazy heart simply refuses to listen unless my beloved is here.', d: 'easy' },
  { s: 'Ek Do Teen', m: 'Tezaab', y: 1988, a: ['Alka Yagnik'], h: 'एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरा', hr: 'Ek do teen char paanch cheh saat aath nau das gyarah barah tera', e: 'One, two, three... I spend every single day just counting the moments until I see you.', d: 'easy' },
  { s: 'Chura Ke Dil Mera', m: 'Main Khiladi Tu Anari', y: 1994, a: ['Kumar Sanu', 'Alka Yagnik'], h: 'चुरा के दिल मेरा गोरिया चली', hr: 'Chura ke dil mera goriya chali', e: 'Stealing my heart entirely, the beautiful girl just walked away.', d: 'easy' },
  { s: 'Tum Paas Aaye', m: 'Kuch Kuch Hota Hai', y: 1998, a: ['Udit Narayan'], h: 'तुम पास आए यूँ मुस्कुराए', hr: 'Tum paas aaye yun muskuraye', e: 'You came near and smiled just like that, and changed everything.', d: 'easy' },
  { s: 'Mehndi Laga Ke Rakhna', m: 'Dilwale Dulhania Le Jayenge', y: 1995, a: ['Lata Mangeshkar', 'Udit Narayan'], h: 'मेहँदी लगा के रखना, डोली सजा के रखना', hr: 'Mehndi laga ke rakhna, doli saja ke rakhna', e: 'Keep the henna applied, keep the palanquin decorated. I am coming to take you away.', d: 'easy' },
  { s: 'Bole Chudiyan', m: 'Kabhi Khushi Kabhie Gham', y: 2001, a: ['Alka Yagnik', 'Kavita Krishnamurthy'], h: 'बोले चूड़ियाँ, बोले कंगना', hr: 'Bole chudiyan, bole kangana', e: 'My bangles are speaking, my bracelets are speaking... only about you.', d: 'easy' },
  { s: 'Dhoom Machale', m: 'Dhoom', y: 2004, a: ['Sunidhi Chauhan'], h: 'धूम मचाले धूम मचाले धूम', hr: 'Dhoom machale dhoom machale dhoom', e: 'Create a massive uproar, let the whole world hear the noise of our arrival.', d: 'easy' },
  { s: 'Kajra Mohabbat Wala', m: 'Kismat', y: 1968, a: ['Asha Bhosle', 'Shamshad Begum'], h: 'कजरा मोहब्बत वाला, अखियों में ऐसा डाला', hr: 'Kajra mohabbat wala, akhiyon mein aisa dala', e: 'The kohl of love applied in those eyes has completely destroyed my peace.', d: 'easy' },
  { s: 'Chittiyaan Kalaiyaan', m: 'Roy', y: 2015, a: ['Kanika Kapoor'], h: 'चिट्टियाँ कलाइयाँ वे', hr: 'Chittiyaan kalaiyaan ve', e: 'Oh these fair, delicate wrists of mine... you should be holding them.', d: 'easy' },
  { s: 'Lungi Dance', m: 'Chennai Express', y: 2013, a: ['Yo Yo Honey Singh'], h: 'लुंगी डांस लुंगी डांस', hr: 'Lungi dance lungi dance', e: 'Forget all your troubles and just dance the lungi dance with me.', d: 'easy' },
  { s: 'Aankh Marey', m: 'Simmba', y: 2018, a: ['Neha Kakkar', 'Mika Singh'], h: 'ओ लड़की आँख मारे', hr: 'O ladki aankh marey', e: 'Oh, that girl just winked at me and the whole world stopped.', d: 'easy' },
  { s: 'Jai Jai Shivshankar', m: 'War', y: 2019, a: ['Vishal Dadlani', 'Benny Dayal'], h: 'जय जय शिवशंकर', hr: 'Jai jai shivshankar', e: 'Praise be to the Lord, for tonight we dance until the sky falls down.', d: 'easy' },
  { s: 'Dilbar', m: 'Satyameva Jayate', y: 2018, a: ['Neha Kakkar'], h: 'दिलबर दिलबर', hr: 'Dilbar dilbar', e: 'Oh my beloved, oh my beloved, my heart beats only for you.', d: 'easy' },
  { s: 'Ghoomar', m: 'Padmaavat', y: 2018, a: ['Shreya Ghoshal'], h: 'घूमर रमवाने आप पधारो सा', hr: 'Ghoomar ramwane aap padharo sa', e: 'Please grace us with your presence, so the swirling dance of Ghoomar can finally begin.', d: 'easy' },
  { s: 'Bom Diggy Diggy', m: 'Sonu Ke Titu Ki Sweety', y: 2018, a: ['Zack Knight', 'Jasmin Walia'], h: 'बॉम डिग्गी डिग्गी बॉम बॉम', hr: 'Bom diggy diggy bom bom', e: 'The beat drops heavy, and the whole floor shakes with the rhythm of the night.', d: 'easy' },
  { s: 'Aapka Kya Hoga Janabe Ali', m: 'Housefull', y: 2010, a: ['Mika Singh', 'Sunidhi Chauhan'], h: 'आपका क्या होगा जनाबे आली', hr: 'Aapka kya hoga janabe ali', e: 'What will happen to you now, oh respectable sir? You have fallen into our trap.', d: 'easy' },
  { s: 'Kar Gayi Chull', m: 'Kapoor & Sons', y: 2016, a: ['Badshah', 'Fazilpuria'], h: 'लड़की ब्यूटीफुल कर गई चुल्ल', hr: 'Ladki beautiful kar gayi chull', e: 'This beautiful girl just completely messed with my mind and left me restless.', d: 'easy' },
  { s: 'Saturday Saturday', m: 'Humpty Sharma Ki Dulhania', y: 2014, a: ['Indeep Bakshi', 'Badshah'], h: 'कुड़ी सैटरडे सैटरडे करदी रेंदी ऐ', hr: 'Kudi saturday saturday kardi rendi ae', e: 'This girl does nothing but wait for Saturday to come around so she can party.', d: 'easy' },
  { s: 'Abhi Toh Party Shuru Hui Hai', m: 'Khoobsurat', y: 2014, a: ['Badshah', 'Aastha'], h: 'अभी तो पार्टी शुरू हुई है', hr: 'Abhi toh party shuru hui hai', e: 'Why are you tired already? The party has literally only just begun.', d: 'easy' },
  { s: 'Desi Girl', m: 'Dostana', y: 2008, a: ['Shankar Mahadevan', 'Sunidhi Chauhan'], h: 'माय देसी गर्ल, माय देसी गर्ल', hr: 'My desi girl, my desi girl', e: 'There is nobody else in the world quite like my beautiful hometown girl.', d: 'easy' },
  { s: 'Gallan Goodiyaan', m: 'Dil Dhadakne Do', y: 2015, a: ['Yashita Sharma', 'Manish J Tipu'], h: 'गल्लां गूड़ियां', hr: 'Gallan goodiyaan', e: 'Let us have some deep, sweet, endless conversations tonight.', d: 'easy' },
  { s: 'Tune Maari Entriyaan', m: 'Gunday', y: 2014, a: ['Bappi Lahiri', 'KK', 'Neeti Mohan'], h: 'तूने मारी एंट्रियाँ रे, दिल में बजी घंटियाँ', hr: 'Tune maari entriyaan re, dil mein baji ghantiyaan', e: 'The exact moment you made your entrance, a thousand bells started ringing in my heart.', d: 'easy' },
  { s: 'Mauja Hi Mauja', m: 'Jab We Met', y: 2007, a: ['Mika Singh'], h: 'मौजा ही मौजा', hr: 'Mauja hi mauja', e: 'There is nothing but pure joy and celebration everywhere I look.', d: 'easy' },
  { s: 'Chammak Challo', m: 'Ra.One', y: 2011, a: ['Akon', 'Hamsika Iyer'], h: 'तू मेरी छम्मक छल्लो', hr: 'Tu meri chammak challo', e: 'You are my shining star, my absolute showstopper. Come dance with me.', d: 'easy' },
  { s: 'Sheila Ki Jawani', m: 'Tees Maar Khan', y: 2010, a: ['Sunidhi Chauhan', 'Vishal Dadlani'], h: 'माय नेम इज़ शीला', hr: 'My name is Sheila', e: 'My name is Sheila, and I am far too young and wild to be tamed by anyone.', d: 'easy' },
  { s: 'Munni Badnaam Hui', m: 'Dabangg', y: 2010, a: ['Mamta Sharma', 'Aishwarya Nigam'], h: 'मुन्नी बदनाम हुई डार्लिंग तेरे लिए', hr: 'Munni badnaam hui darling tere liye', e: 'Munni ruined her entire reputation in this town, darling, and she did it all for you.', d: 'easy' },
  { s: 'Gori Gori', m: 'Main Hoon Na', y: 2004, a: ['Sunidhi Chauhan', 'Shreya Ghoshal'], h: 'गोरी गोरी, गोरी गोरी', hr: 'Gori gori, gori gori', e: 'Oh beautiful fair girl, you have set the entire dance floor completely on fire.', d: 'easy' },
  { s: 'Aap Ka Aana Dil Dhadkana', m: 'Kurukshetra', y: 2000, a: ['Kumar Sanu', 'Alka Yagnik'], h: 'आपका आना, दिल धड़काना', hr: 'Aap ka aana, dil dhadkana', e: 'Your arrival... and then the sudden racing of my heart. It happens every time.', d: 'easy' },
  { s: 'Koi Mil Gaya', m: 'Kuch Kuch Hota Hai', y: 1998, a: ['Udit Narayan', 'Alka Yagnik', 'Kavita Krishnamurthy'], h: 'कोई मिल गया, कोई मिल गया', hr: 'Koi mil gaya, koi mil gaya', e: 'I finally found someone. Someone my heart has been searching for everywhere.', d: 'easy' },
  { s: 'Tip Tip Barsa Paani', m: 'Mohra', y: 1994, a: ['Udit Narayan', 'Alka Yagnik'], h: 'टिप टिप बरसा पानी, पानी ने आग लगाई', hr: 'Tip tip barsa paani, paani ne aag lagayi', e: 'The rain poured down drop by drop, and somehow, the water ended up setting everything on fire.', d: 'easy' },

  // MEDIUM (Melodies, Depth)
  { s: 'Jashn-E-Bahaara', m: 'Jodhaa Akbar', y: 2008, a: ['Javed Ali'], h: 'कहने को जश्ने बहारा है, इश्क़ ये देखके हैरान है', hr: 'Kehne ko jashne bahaara hai, ishq ye dekhke hairan hai', e: 'They say it is a celebration of spring, yet love stands aside, watching it all in complete bewilderment.', d: 'medium' },
  { s: 'In Dino', m: 'Life in a... Metro', y: 2007, a: ['Soham Chakraborty'], h: 'इन दिनों दिल मेरा, मुझसे है कह रहा', hr: 'In dino dil mera, mujhse hai keh raha', e: 'These days, my heart keeps whispering something strange to me over and over again.', d: 'medium' },
  { s: 'Dil Se Re', m: 'Dil Se', y: 1998, a: ['A.R. Rahman'], h: 'दिल से रे', hr: 'Dil se re', e: 'Right from the very core of my heart. A raw, unedited confession of my soul.', d: 'medium' },
  { s: 'Tu Hi Re', m: 'Bombay', y: 1995, a: ['Hariharan', 'Kavita Krishnamurthy'], h: 'तू ही रे, तू ही रे, तेरे बिना मैं कैसे जियूँ', hr: 'Tu hi re, tu hi re, tere bina main kaise jiyun', e: 'It is only you. Tell me, how am I supposed to breathe in a world where you do not exist?', d: 'medium' },
  { s: 'Kal Ho Naa Ho (Sad)', m: 'Kal Ho Naa Ho', y: 2003, a: ['Sonu Nigam'], h: 'चाहे जो तुम्हें पूरे दिल से', hr: 'Chahe jo tumhe poore dil se', e: 'Whoever loves you with their entire, unbroken heart... keep them close.', d: 'medium' },
  { s: 'Main Agar Kahoon', m: 'Om Shanti Om', y: 2007, a: ['Sonu Nigam', 'Shreya Ghoshal'], h: 'मैं अगर कहूँ तुमसा हसीं, कायनात में नहीं है कहीं', hr: 'Main agar kahoon tumsa haseen, qaaynaat mein nahi hai kahin', e: 'If I were to say that someone as beautiful as you does not exist anywhere in this universe, it would still not be enough.', d: 'medium' },
  { s: 'O Saathi Re (Kishore)', m: 'Muqaddar Ka Sikandar', y: 1978, a: ['Kishore Kumar'], h: 'ओ साथी रे, तेरे बिना भी क्या जीना', hr: 'O saathi re, tere bina bhi kya jeena', e: 'Oh my companion, what is the point of even living if it has to be lived without you?', d: 'medium' },
  { s: 'Tere Bina Jiya Jaye Na', m: 'Ghar', y: 1978, a: ['Lata Mangeshkar'], h: 'तेरे बिना जिया जाये ना', hr: 'Tere bina jiya jaye na', e: 'I cannot bring myself to live without you. The days refuse to pass.', d: 'medium' },
  { s: 'Sagar Jaisi Aankhon Wali', m: 'Saagar', y: 1985, a: ['Kishore Kumar'], h: 'सागर जैसी आँखों वाली, ये तो बता तेरा नाम है क्या', hr: 'Sagar jaisi aankhon wali, ye toh bata tera naam hai kya', e: 'You with eyes as deep as the ocean... please, at least tell me your name.', d: 'medium' },
  { s: 'Kuch Na Kaho', m: '1942: A Love Story', y: 1994, a: ['Kumar Sanu'], h: 'कुछ ना कहो, कुछ भी ना कहो', hr: 'Kuch na kaho, kuch bhi na kaho', e: 'Do not say anything at all. Let the silence between us do all the talking.', d: 'medium' },
  { s: 'Ajeeb Dastan Hai Yeh', m: 'Dil Apna Aur Preet Parai', y: 1960, a: ['Lata Mangeshkar'], h: 'अजीब दास्ताँ है ये, कहाँ शुरू कहाँ खतम', hr: 'Ajeeb dastan hai yeh, kahan shuru kahan khatam', e: 'What a strange story this is. We don\'t know where it began, and we don\'t know where it will end.', d: 'medium' },
  { s: 'Dil To Pagal Hai', m: 'Dil To Pagal Hai', y: 1997, a: ['Udit Narayan', 'Lata Mangeshkar'], h: 'दिल तो पागल है, दिल दीवाना है', hr: 'Dil to pagal hai, dil deewana hai', e: 'The heart is completely mad. The heart is a restless, irrational fool.', d: 'medium' },
  { s: 'Pehla Pehla Pyar', m: 'Hum Aapke Hain Koun', y: 1994, a: ['S. P. Balasubrahmanyam'], h: 'पहला पहला प्यार है, पहली पहली बार है', hr: 'Pehla pehla pyar hai, pehli pehli baar hai', e: 'It is the very first time I have ever been in love. And it is hitting me all at once.', d: 'medium' },
  { s: 'Ek Ladki Ko Dekha', m: '1942: A Love Story', y: 1994, a: ['Kumar Sanu'], h: 'एक लड़की को देखा तो ऐसा लगा', hr: 'Ek ladki ko dekha toh aisa laga', e: 'When I saw that girl, it felt like... like a blooming rose, like a poet\'s dream.', d: 'medium' },
  { s: 'Suraj Hua Maddham', m: 'Kabhi Khushi Kabhie Gham', y: 2001, a: ['Sonu Nigam', 'Alka Yagnik'], h: 'सूरज हुआ मद्धम, चाँद जलने लगा', hr: 'Suraj hua maddham, chaand jalne laga', e: 'The sun has dimmed its light, and the moon has suddenly caught on fire. Am I falling in love?', d: 'medium' },
  { s: 'Sunidhi Chauhan', m: 'Fanaa', y: 2006, a: ['Shaan', 'Kailash Kher'], h: 'चाँद सिफारिश जो करता हमारी, देता वो तुमको बता', hr: 'Chand sifarish jo karta hamari, deta wo tumko bata', e: 'If the moon were to put in a good word for me, it would surely tell you how much I ache for you.', d: 'medium' },
  { s: 'Pee Loon', m: 'Once Upon a Time in Mumbaai', y: 2010, a: ['Mohit Chauhan'], h: 'पी लूँ तेरे नीले नीले नैनों से शबनम', hr: 'Pee loon tere neele neele nainon se shabnam', e: 'Let me drink the fresh dew straight from your deep blue eyes.', d: 'medium' },
  { s: 'Iktara (Male)', m: 'Wake Up Sid', y: 2009, a: ['Tochi Raina'], h: 'ओ रे मनवा तू तो बावरा है', hr: 'O re manwa tu toh bawra hai', e: 'Oh my heart, you are a complete lunatic. Why do you chase after things you cannot hold?', d: 'medium' },
  { s: 'Kabira (Encore)', m: 'Yeh Jawaani Hai Deewani', y: 2013, a: ['Arijit Singh'], h: 'रे कबीरा मान जा', hr: 'Re kabira maan ja', e: 'Oh wanderer, please listen to reason. Stop running away from where you belong.', d: 'medium' },
  { s: 'Gerua', m: 'Dilwale', y: 2015, a: ['Arijit Singh'], h: 'धूप से छन के, धूप से छन के', hr: 'Dhoop se chhan ke, dhoop se chhan ke', e: 'Filtering through the harsh sunlight, your love arrives to cool my burning skin.', d: 'medium' },
  { s: 'Agar Tum Mil Jao', m: 'Zeher', y: 2005, a: ['Shreya Ghoshal'], h: 'अगर तुम मिल जाओ, ज़माना छोड़ देंगे हम', hr: 'Agar tum mil jao, zamana chhod denge hum', e: 'If I could just have you by my side, I would happily abandon the rest of the world.', d: 'medium' },
  { s: 'Jeena Jeena', m: 'Badlapur', y: 2015, a: ['Atif Aslam'], h: 'देहलीज़ पे मेरे दिल की, जो रखे हैं तूने कदम', hr: 'Dehleez pe mere dil ki, jo rakhe hain tune kadam', e: 'The moment you placed your foot upon the threshold of my heart, everything changed.', d: 'medium' },
  { s: 'Ban Ja Tu Meri Rani', m: 'Tumhari Sulu', y: 2017, a: ['Guru Randhawa'], h: 'बन जा तू मेरी रानी, तेनू महल दवा दूँगा', hr: 'Ban ja tu meri rani, tenu mahal dawa dunga', e: 'Become my queen, and I promise to build you a palace out of pure devotion.', d: 'medium' },
  { s: 'Dil Diyan Gallan', m: 'Tiger Zinda Hai', y: 2017, a: ['Atif Aslam'], h: 'कच्ची डोरियों, डोरियों, डोरियों से मैनू तू बाँध ले', hr: 'Kacchi doriyon, doriyon, doriyon se mainu tu baandh le', e: 'Tie me to yourself with the most fragile of threads. I promise I will never break them.', d: 'medium' },
  { s: 'Zaalima', m: 'Raees', y: 2017, a: ['Arijit Singh'], h: 'ओ ज़ालिमा, जो तेरी खातिर तड़पे पहले से ही', hr: 'O zaalima, jo teri khatir tadpe pehle se hi', e: 'Oh cruel one, what is the point of tormenting a heart that is already suffering for you?', d: 'medium' },
  { s: 'Enna Sona', m: 'OK Jaanu', y: 2017, a: ['Arijit Singh'], h: 'एन्ना सोणा क्यूँ रब्ब ने बनाया', hr: 'Enna sona kyun rabb ne banaya', e: 'Why did God create you so incredibly beautiful? It is almost unfair to the rest of us.', d: 'medium' },

  // HARD (Deep Cuts, Sufi, Intense)
  { s: 'Tujhe Kitna Chahne Lage', m: 'Kabir Singh', y: 2019, a: ['Arijit Singh'], h: 'दिल का दरिया बह ही गया', hr: 'Dil ka dariya beh hi gaya', e: 'The heavy river built up inside my heart finally breached its banks and washed everything away.', d: 'hard' },
  { s: 'Kalank (Title Track)', m: 'Kalank', y: 2019, a: ['Arijit Singh'], h: 'हवाओं में बहेंगे, घटाओं में रहेंगे', hr: 'Hawaon mein bahenge, ghataon mein rahenge', e: 'We will flow within the winds, we will reside within the dark rainclouds. We will never truly leave.', d: 'hard' },
  { s: 'Nadaan Parindey', m: 'Rockstar', y: 2011, a: ['A.R. Rahman', 'Mohit Chauhan'], h: 'कागा रे कागा रे मोरी इतनी अरज तोसे', hr: 'Kaaga re kaaga re mori itni araj tose', e: 'Oh crow, I have only one desperate request for you. Do not pluck the eyes that are still waiting to see her.', d: 'hard' },
  { s: 'Tum Se Hi', m: 'Jab We Met', y: 2007, a: ['Mohit Chauhan'], h: 'तुम से ही दिन होता है, सुरमई शाम आती है', hr: 'Tum se hi din hota hai, surmai shaam aati hai', e: 'You are the reason the day begins and the evening turns that particular shade of amber.', d: 'hard' },
  { s: 'Aayat', m: 'Bajirao Mastani', y: 2015, a: ['Arijit Singh'], h: 'तुझे याद कर लिया है आयत की तरह', hr: 'Tujhe yaad kar liya hai aayat ki tarah', e: 'I have memorized you. I have learned you by heart the way one memorizes a holy verse.', d: 'hard' },
  { s: 'Tadap Tadap Ke', m: 'Hum Dil De Chuke Sanam', y: 1999, a: ['KK'], h: 'तड़प तड़प के इस दिल से आह निकलती रही', hr: 'Tadap tadap ke is dil se aah nikalti rahi', e: 'Writhing in agony, a continuous, breathless sigh keeps escaping from this shattered heart.', d: 'hard' },
  { s: 'Gali Mein Aaj Chand Nikla', m: 'Zakhm', y: 1998, a: ['Alka Yagnik'], h: 'गली में आज चाँद निकला', hr: 'Gali mein aaj chand nikla', e: 'After an eternity of darkness, the moon has finally graced our small alleyway tonight.', d: 'hard' },
  { s: 'Jiyein Kyun', m: 'Dum Maaro Dum', y: 2011, a: ['Papon'], h: 'ना आये हो, ना आओगे, ना फोन पे बुलाओगे', hr: 'Na aaye ho, na aaoge, na phone pe bulaoge', e: 'You haven\'t come, and you won\'t come. Why am I even still trying to breathe?', d: 'hard' },
  { s: 'Kahin To', m: 'Jaane Tu... Ya Jaane Na', y: 2008, a: ['Rashid Ali'], h: 'कहीं तो होगी वो दुनिया जहाँ तू मेरे साथ है', hr: 'Kahin to hogi wo duniya jahan tu mere saath hai', e: 'There must exist some alternate universe out there where you are actually walking beside me.', d: 'hard' },
  { s: 'Aaoge Jab Tum', m: 'Jab We Met', y: 2007, a: ['Ustad Rashid Khan'], h: 'आओगे जब तुम ओ साजना, अंगना फूल खिलेंगे', hr: 'Aaoge jab tum o saajana, angana phool khilenge', e: 'The day you finally return, my beloved... the barren courtyard will burst into a thousand blooming flowers.', d: 'hard' },
  { s: 'Man Ana Man Ana', m: 'Manto', y: 2018, a: ['Sneha Khanwalkar'], h: 'मंटोयत', hr: 'Mantoyat', e: 'The brutal, unfiltered truth of existence that society desperately tries to hide with silk sheets.', d: 'hard' },
  { s: 'Beedi', m: 'Omkara', y: 2006, a: ['Sunidhi Chauhan', 'Sukhwinder Singh'], h: 'बीड़ी जलइले जिगर से पिया, जिगर मा बड़ी आग है', hr: 'Beedi jalaile jigar se piya, jigar ma badi aag hai', e: 'Light your cigarette from the burning of my heart, my love. There is a massive fire raging inside me.', d: 'hard' },
  { s: 'Namak Ishq Ka', m: 'Omkara', y: 2006, a: ['Rekha Bhardwaj'], h: 'ज़बान पे लगा लगा रे, नमक इश्क़ का', hr: 'Zabaan pe laga laga re, namak ishq ka', e: 'The sharp, stinging salt of love has touched my tongue, and now I crave its bite forever.', d: 'hard' },
  { s: 'Saudebaazi', m: 'Aakrosh', y: 2010, a: ['Javed Ali'], h: 'सीधी सादी सी है ये सौदेबाज़ी', hr: 'Seedhi saadi si hai ye saudebaazi', e: 'This is a very simple transaction. I give you my entire soul, and you give me nothing but a glance.', d: 'hard' },
  { s: 'Moh Moh Ke Dhaage', m: 'Dum Laga Ke Haisha', y: 2015, a: ['Papon', 'Monali Thakur'], h: 'ये मोह मोह के धागे, तेरी उँगलियों से जा उलझे', hr: 'Ye moh moh ke dhaage, teri ungliyon se ja uljhe', e: 'These fragile, affectionate threads of my heart have gone and helplessly tangled themselves in your fingers.', d: 'hard' },
  { s: 'Bulleya', m: 'Ae Dil Hai Mushkil', y: 2016, a: ['Amit Mishra'], h: 'मेरी रूह का परिंदा फड़फड़ाये, लेकिन सुकून का जज़ीरा मिल ना पाये', hr: 'Meri rooh ka parinda phadphadaye, lekin sukoon ka jazeera mil na paye', e: 'The bird of my soul furiously flaps its wings, yet it cannot find a single island of peace to land upon.', d: 'hard' },
  { s: 'Tere Liye', m: 'Veer-Zaara', y: 2004, a: ['Lata Mangeshkar', 'Roop Kumar Rathod'], h: 'तेरे लिए हम हैं जिये, होठों को सिये', hr: 'Tere liye hum hain jiye, hothon ko siye', e: 'I have lived my entire life only for you, with my lips sewn shut to hide my suffering.', d: 'hard' },
  { s: 'Lambi Judai', m: 'Hero', y: 1983, a: ['Reshma'], h: 'बिछड़े अभी तो हम बस कल परसों, जीऊँगी मैं कैसे इस हाल में बरसों', hr: 'Bichhde abhi toh hum bas kal parso, jiyungi main kaise is haal mein barson', e: 'We only separated yesterday. How am I supposed to survive in this agony for years to come?', d: 'hard' },
  { s: 'Mora Piya', m: 'Raajneeti', y: 2010, a: ['Aadesh Shrivastava'], h: 'मोरा पिया मोसे बोलत नाहीं', hr: 'Mora piya mose bolat naahi', e: 'My beloved refuses to speak to me. A deafening silence has settled between our souls.', d: 'hard' },
  { s: 'Khamosh Raat', m: 'Thakshak', y: 1999, a: ['Roop Kumar Rathod'], h: 'खामोश रात सहमी हवा', hr: 'Khamosh raat sehmi hawa', e: 'The night is entirely silent, and even the wind seems terrified to breathe.', d: 'hard' },
  { s: 'Aur Ho', m: 'Rockstar', y: 2011, a: ['Mohit Chauhan'], h: 'मेरी बेबसी का बयान है, बस चल रहा ना इस घड़ी', hr: 'Meri bebasi ka bayaan hai, bas chal raha na is ghadi', e: 'This is the pure expression of my helplessness. I have absolutely no control over myself right now.', d: 'hard' },
  { s: 'O Re Piya', m: 'Aaja Nachle', y: 2007, a: ['Rahat Fateh Ali Khan'], h: 'उड़ने लगा क्यों मन बावरा रे', hr: 'Udne laga kyon man bawra re', e: 'Why has this foolish mind suddenly started to take flight without any wings?', d: 'hard' },
  { s: 'Yeh Honsla', m: 'Dor', y: 2006, a: ['Shafqat Amanat Ali'], h: 'ये हौंसला कैसे झुके, ये आरज़ू कैसे रुके', hr: 'Ye honsla kaise jhuke, ye aarzoo kaise ruke', e: 'How could this courage ever bow down? How could this burning desire ever be stopped?', d: 'hard' }
];

async function run() {
  const finalSongs = [];
  for (let s of extraSongs) {
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
          hint: `An absolute classic from ${s.m}`
        });
      }
    } catch(e) {
      console.error('Failed to fetch', s.s);
    }
  }

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
    const all = songs.filter(s => s.difficulty === difficulty);
    if (all.length === 0) return null;
    return all[Math.floor(Math.random() * all.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}
`;
  
  fs.writeFileSync('src/data/songs.ts', newCode);
  console.log(`Added ${finalSongs.length} MORE songs! Grand total: ${existingSongs.length + finalSongs.length}`);
}

run();

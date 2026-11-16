interface Topic {
  keywords: RegExp[];
  answer: string;
  hints: string[];
}

const TOPICS: Topic[] = [
  {
    keywords: [/computer network/, /what is (a )?network/, /network meaning|network definition/, /resource shar|share (files|resources|printer)/, /\bnodes?\b/, /advantages? of (a )?network/],
    answer:
      'A computer network is a group of connected computers and devices that can communicate and share resources such as files, printers, and internet access. The connections can be wired, wireless, or both. Your school Wi-Fi is a simple example of a network.',
    hints: ['What are the types of networks (LAN, MAN, WAN)?', 'What are the parts of a data packet?'],
  },
  {
    keywords: [/\blan\b/, /\bwan\b/, /\bman\b/, /\bpan\b/, /types? of network/, /local area|wide area|metropolitan|personal area/],
    answer:
      'A PAN (Personal Area Network) connects personal devices within a few metres, like a phone and Bluetooth earphones. A LAN (Local Area Network) covers a small area such as a school or lab. A MAN (Metropolitan Area Network) covers a city, and a WAN (Wide Area Network) covers countries or the world. The internet is the biggest WAN.',
    hints: ['What is the internet and how is it different from the web?', 'What are network devices like a router and a switch?'],
  },
  {
    keywords: [/topolog/, /\bbus\b/, /\bstar\b/, /\bring\b/, /\bmesh\b/, /layout of (a )?network/],
    answer:
      'Network topology is the way devices are arranged and connected. In a star topology every device connects to a central switch or hub, in a bus topology devices share one main cable, in a ring topology devices form a circle, and in a mesh topology devices have many direct links.',
    hints: ['What is a LAN?', 'What is a router?'],
  },
  {
    keywords: [/modem/, /\bhub\b/, /\bswitch\b/, /\bnic\b|network (interface )?card/, /gateway/, /access point/, /repeater/, /network devices?/],
    answer:
      'A modem connects your network to the internet service provider. A switch connects devices in a LAN and sends data only to the device that needs it, while a hub sends it to everyone. A router connects different networks and finds the best path for packets. A network interface card (NIC) lets a device join a network, and an access point provides Wi-Fi.',
    hints: ['What does a router do with packets?', 'What are wired and wireless transmission media?'],
  },
  {
    keywords: [/internet/, /\bwww\b|world wide web/, /browser/, /website|web page/, /\burl\b/, /\bdns\b/, /ip address/, /\bhttps?\b/],
    answer:
      'The internet is a worldwide system of interconnected networks. The World Wide Web is one service that runs on the internet: it is a collection of linked web pages that you open with a browser using a URL. DNS turns a website name into an IP address.',
    hints: ['What is a protocol?', 'What is a data packet?'],
  },
  {
    keywords: [/protocol/, /\btcp\b/, /\bip\b/, /rules (for|of) (communication|sending)/],
    answer:
      'A protocol is a set of rules that devices follow to communicate. TCP/IP is the main protocol suite of the internet: IP gives addresses and routes packets, and TCP helps make sure data arrives complete and in order. HTTP/HTTPS is used to load web pages.',
    hints: ['How are packets reassembled?', 'What is the internet?'],
  },
  {
    keywords: [/bandwidth/, /\bspeed\b/, /\bbps\b|mbps|gbps/, /data rate|throughput/, /latency|lag/],
    answer:
      'Bandwidth is the amount of data a connection can carry in a given time, measured in bits per second (bps, Mbps, Gbps). Higher bandwidth can mean faster downloads and smoother video. Fibre-optic cables usually offer much higher bandwidth than twisted-pair or coaxial cables.',
    hints: ['Why is fibre-optic cable so fast?', 'What causes signal loss in a cable?'],
  },
  {
    keywords: [/packet/, /packet switching/, /data (is )?(split|divided|broken)/, /small (pieces|chunks|units)/],
    answer:
      'A data packet is a small unit of information sent across a network. A large file or message is split into packets; they travel across the network and are put back together at the destination. Each packet has a header, a payload, and sometimes a trailer.',
    hints: ['What do the header, payload and trailer contain?', 'Why are files split into packets?'],
  },
  {
    keywords: [/header/, /payload/, /trailer|footer/, /source address|destination address/, /sequence number/, /checksum|error.?check/, /parts? of (a )?packet|structure of (a )?packet/],
    answer:
      'The header carries control information such as the source address, destination address, and packet number. The payload is the actual data being sent. The trailer marks the end of the packet and may hold error-checking information so the receiver can detect damage.',
    hints: ['How are packets reassembled?', 'What does a router do?'],
  },
  {
    keywords: [/router/, /routing/, /\broute\b|\bpath\b|fastest/, /\bhops?\b/, /forward/],
    answer:
      "A router reads a packet's destination address and forwards it towards its destination along an available path. A packet may pass through several routers, called hops, and packets from the same message can take different routes.",
    hints: ['How are packets put back in order?', 'What are network devices like a switch and a modem?'],
  },
  {
    keywords: [/reassembl/, /re-?order|out of order|wrong order/, /put (back )?together|rebuild/, /lost packet|missing packet|resend|retransmit/, /sequence/],
    answer:
      'At the destination, packet numbers help put data back in the correct order, even if packets arrived out of order. If a packet is missing or damaged, it can be sent again, and then the full message is rebuilt.',
    hints: ['What is in a packet header?', 'Why are files split into packets?'],
  },
  {
    keywords: [/why.*(packet|split|divid|broken)/, /why.*(use|need|important|split|send)/, /advantage|benefit|reason/, /efficien|congestion|reliab/],
    answer:
      'Splitting data into packets makes networks efficient and reliable. Many users can share the same lines, a damaged packet can be resent without resending the whole file, and packets can take different routes to avoid busy or broken paths.',
    hints: ['What does a router do?', 'How are packets reassembled?'],
  },
  {
    keywords: [/transmission media|transmission medium/, /\bmedia\b|\bmedium\b/, /guided|unguided/, /wired/, /wireless/, /types? of (transmission )?media/],
    answer:
      'Transmission media are the paths that carry data signals from sender to receiver. Wired (guided) media include twisted-pair, coaxial, and fibre-optic cables. Wireless (unguided) media include radio waves, microwaves, infrared, and satellite links.',
    hints: ['How does a twisted-pair cable work?', 'Why is fibre-optic cable so fast?'],
  },
  {
    keywords: [/twisted/, /\butp\b|\bstp\b/, /ethernet/, /cat ?[3-8]/, /lan cable|rj-?45/],
    answer:
      'A twisted-pair cable has copper wires twisted around each other to reduce interference and crosstalk. UTP is unshielded and inexpensive; STP has a metal shield for extra protection. Ethernet LAN cables commonly use twisted pair.',
    hints: ['What is a coaxial cable?', 'What is crosstalk?'],
  },
  {
    keywords: [/coax/, /cable tv|tv cable|cable television/, /\bbnc\b/],
    answer:
      'A coaxial cable has a central copper wire surrounded by insulation, a metal shield, and an outer cover. The shield protects the signal from interference. Coaxial cable is used for cable TV and some broadband connections.',
    hints: ['How is fibre-optic cable different?', 'What is a twisted-pair cable?'],
  },
  {
    keywords: [/fib(re|er)/, /optic/, /light (pulse|signal)/, /total internal reflection/, /glass|laser|\bled\b/],
    answer:
      'A fibre-optic cable sends data as pulses of light through thin strands of glass or plastic. It can carry data quickly over long distances and is not affected by electrical interference. It has high bandwidth but can cost more and be harder to install.',
    hints: ['What is bandwidth?', 'Compare twisted-pair, coaxial and fibre-optic cables.'],
  },
  {
    keywords: [/compar/, /difference between (twisted|coax|fib)/, /which (cable|media) is (best|fastest)/, /\bvs\b|versus/],
    answer:
      'Twisted pair is inexpensive and easy to install but has a shorter range. Coaxial resists interference better and carries data farther. Fibre-optic is very fast, works over long distances, and is immune to electrical interference, but can cost more.',
    hints: ['What is attenuation?', 'What are wireless media?'],
  },
  {
    keywords: [/radio wave/, /wi-?fi/, /bluetooth/, /\bfm\b|\bam\b|radio/, /omni/],
    answer:
      'Radio waves are electromagnetic waves used for FM radio, Wi-Fi, Bluetooth, and mobile phones. They can travel in many directions and may pass through walls, so they are convenient without cables. Wireless signals can be affected by distance and interference.',
    hints: ['What are microwaves?', 'How do mobile phones use radio waves?'],
  },
  {
    keywords: [/microwave/, /line.?of.?sight/, /dish|antenna/],
    answer:
      'Microwaves are high-frequency radio waves used for point-to-point communication between towers or dishes. The antennas need line of sight, so obstacles can weaken the signal. Microwaves can carry large amounts of data.',
    hints: ['What is satellite communication?', 'What is infrared?'],
  },
  {
    keywords: [/infra.?red/, /remote control|tv remote/, /\bir\b/],
    answer:
      'Infrared waves carry data over short distances using invisible light, such as between a TV remote and a TV. They need a clear line of sight and cannot pass through walls.',
    hints: ['What are microwaves?', 'What are radio waves?'],
  },
  {
    keywords: [/satellite/, /\bgps\b/, /geostationary|orbit/, /vsat|uplink|downlink/],
    answer:
      'In satellite communication, a ground station sends a signal up to a satellite, which relays it back down to another place. Satellites can cover remote areas and support TV, GPS, and weather data. Long distances can cause delay.',
    hints: ['What are microwaves?', 'What are the types of wireless media?'],
  },
  {
    keywords: [/attenuation/, /noise/, /interference/, /crosstalk/, /dispersion|distortion/, /signal (loss|weak)|weaken/, /impairment/],
    answer:
      'Transmission impairments are problems that damage a signal. Attenuation is signal strength loss over distance; noise and interference are unwanted signals; crosstalk is leakage between nearby wires; and distortion changes a signal’s shape. Shielding, repeaters, and fibre-optic cables can help.',
    hints: ['What is crosstalk?', 'Why is fibre-optic cable better?'],
  },
  {
    keywords: [/netiquette/, /online (manners|behaviou?r|etiquette)/, /\brespect/, /polite/, /rules? (for|of) (the )?(internet|online)/],
    answer:
      "Netiquette means good manners and respectful behaviour online. Use polite language, respect other people's views and privacy, think before you post, check facts before sharing, and give credit for other people's work. Treat people online as you would face to face.",
    hints: ['How can I protect my privacy online?', 'What is cyberbullying?'],
  },
  {
    keywords: [/privacy/, /personal (information|details|data)/, /password/, /\bsafe(ty)?\b|secure/, /stranger/],
    answer:
      "Protect your privacy by not sharing personal details such as your address, phone number, school, or passwords with strangers. Use strong passwords and think about who can see your posts. Do not share someone else's photos or information without permission.",
    hints: ['What is cyberbullying?', 'How do I spot fake news?'],
  },
  {
    keywords: [/fake news/, /misinformation|rumou?r|hoax/, /verify|fact.?check|\bfacts?\b/, /\bsources?\b|trusted|reliable/, /forward(ed)? message/],
    answer:
      'Before sharing a claim, check who published it and look for the same information from trusted sources. Be cautious of shocking headlines or claims you cannot verify. If you are unsure, do not forward it.',
    hints: ['What is netiquette?', 'What is copyright?'],
  },
  {
    keywords: [/bully|bullying/, /harass|troll/, /offensive|abus|hate/, /insult|mean comments?/, /report (a )?(user|post)|block/],
    answer:
      'Cyberbullying is using the internet or phones to hurt, scare, or embarrass someone. Do not reply angrily: save evidence, block and report the person, and tell a trusted adult or teacher. Do not join in or forward hurtful content.',
    hints: ['How can I protect my privacy online?', 'What is good email etiquette?'],
  },
  {
    keywords: [/e-?mail/, /subject line/, /\bcc\b|\bbcc\b|reply all/, /capital letters|all caps|shout/, /emoji|chat language|sms language/, /message|chat etiquette/],
    answer:
      'In emails and chats, use a clear subject, greet politely, and keep the message focused. Avoid typing in ALL CAPS, which can look like shouting, and check your message before sending. Use Reply All only when everyone needs the reply.',
    hints: ['What is netiquette?', 'What is cyberbullying?'],
  },
  {
    keywords: [/copyright/, /plagiar/, /piracy|pirated/, /credit|acknowledg|permission/, /download(ing)? (movies|music|software)/],
    answer:
      "Copyright protects creators' work. Copying someone else's work as your own is plagiarism; give credit to the source and ask for permission when needed.",
    hints: ['How do I spot fake news?', 'What is netiquette?'],
  },
  {
    keywords: [/mobile communication/, /mobile (network|phone)/, /cellular|\bcells?\b/, /how (does|do) (a )?mobile/, /wireless communication/],
    answer:
      'Mobile communication lets devices exchange information wirelessly over a cellular network. The area is divided into cells, each served by a tower. Your phone sends radio signals to a nearby tower and can move between cells while staying connected.',
    hints: ['What does a cell tower do?', 'What is a SIM card?'],
  },
  {
    keywords: [/cell tower|mobile tower|base station/, /\btower\b/, /hand.?off|handover/, /coverage|no network|signal strength/],
    answer:
      'A cell tower (base station) sends and receives radio signals to and from phones in its cell. Towers connect to the wider telephone and internet network. When you travel, your call can be handed over from one tower to another.',
    hints: ['What is a SIM card?', 'What are 2G, 3G, 4G and 5G?'],
  },
  {
    keywords: [/\bsim\b/, /subscriber/, /imsi/, /\bgsm\b|\bcdma\b/, /sim card/],
    answer:
      'A SIM (Subscriber Identity Module) identifies a subscriber to the mobile network and stores network details. It helps the network recognize who is making a call or using data. You can usually move your SIM to another phone and keep your number.',
    hints: ['What does a cell tower do?', 'What are the mobile generations?'],
  },
  {
    keywords: [/\b2g\b/, /\bgsm\b/, /\bsms\b/],
    answer:
      '2G introduced digital voice calls and text messages (SMS). It supported slower data than later generations but made mobile messaging widely practical.',
    hints: ['What can 3G do?', 'Compare 2G, 3G, 4G and 5G.'],
  },
  {
    keywords: [/\b3g\b/, /video call/, /mobile internet/],
    answer:
      '3G brought faster mobile internet, making web browsing, email, and video calls on phones possible. It paved the way for modern smartphones.',
    hints: ['What improved in 4G?', 'Compare 2G, 3G, 4G and 5G.'],
  },
  {
    keywords: [/\b4g\b/, /\blte\b/, /volte/, /hd video|streaming/],
    answer:
      '4G (LTE) provides mobile broadband for activities such as streaming video and using apps. VoLTE can carry voice calls over the 4G data network.',
    hints: ['What is special about 5G?', 'Compare 2G, 3G, 4G and 5G.'],
  },
  {
    keywords: [/\b5g\b/, /ultra.?low latency|iot|internet of things|self.?driving|smart (city|home)/],
    answer:
      '5G is designed for high speeds, low delay (latency), and connecting many devices at once. These features can support applications such as smart devices and the Internet of Things.',
    hints: ['Compare 2G, 3G, 4G and 5G.', 'What does a cell tower do?'],
  },
  {
    keywords: [/generation/, /differences?/, /between/, /compar/, /\b[2-5]g\b/, /evolution/, /1g/],
    answer:
      'Mobile generations developed from 1G analogue voice to 2G digital calls and SMS, 3G mobile internet, 4G faster broadband, and 5G higher speeds and lower delay. Each generation added new ways to communicate and use data.',
    hints: ['What is special about 5G?', 'What is a SIM card?'],
  },
];

const THANKS = /\b(thanks|thank you|thx|great|nice|awesome)\b/;
const GREETING = /^(hi|hello|hey|hii+|good (morning|afternoon|evening)|namaste)\b/;
const TOUR = /which room|where (should|do) i (go|start)|visit first|navigate|museum tour|start.*tour|what (can|should) i (learn|explore)|what topics|what can you (do|help)|who are you/;
const ROOM_HINTS: Record<string, string[]> = {
  packets: ['What is a data packet?', 'What are the header, payload and trailer?', 'What does a router do?'],
  'transmission-media': ['What are wired and wireless media?', 'Why is fibre-optic cable fast?', 'What is attenuation?'],
  netiquette: ['What is netiquette?', 'How can I protect my privacy online?', 'How do I spot fake news?'],
  'mobile-comm': ['What is a SIM card?', 'What does a cell tower do?', 'Compare 2G, 3G, 4G and 5G.'],
  explore: ['What is a computer network?', 'What are the types of networks?', 'Where should I start the museum tour?'],
};
const GENERAL_HINTS = ['What is a computer network?', 'What is a data packet?', 'What are transmission media?', 'What is netiquette?', 'How does mobile communication work?'];

const OFF_TOPIC_REPLY =
  "Oops! 😊 I don't know about that topic. I can only share information about computer networks: network basics, data packets, transmission media, netiquette, and mobile communication.";

function formatHints(hints: string[]): string {
  return `\n\n💡 You can also ask: ${hints.map((hint) => `“${hint}”`).join(' or ')}`;
}

export function offlineEduGuideReply(message: string, currentRoom = 'lobby'): string {
  const question = message.toLowerCase().trim();
  const roomHints = ROOM_HINTS[currentRoom] || GENERAL_HINTS.slice(0, 3);

  if (GREETING.test(question) && question.split(/\s+/).length <= 4) {
    return (
      "Hello, explorer! I'm EduGuide, your Virtual Network Museum guide. I can help with computer networks, data packets, transmission media, netiquette, and mobile communication." +
      formatHints(roomHints)
    );
  }

  if (TOUR.test(question)) {
    return (
      'Welcome to the museum! Start with the Packets Room to see how information travels across a network. Then visit Transmission Media (how data is carried), Netiquette (respectful online behaviour), and Mobile Communication (how phones connect).' +
      formatHints(GENERAL_HINTS.slice(0, 2))
    );
  }

  if (THANKS.test(question) && question.split(/\s+/).length <= 6) {
    return "You're welcome, explorer! Keep exploring the museum." + formatHints(roomHints);
  }

  let best: Topic | undefined;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = topic.keywords.reduce((total, keyword) => {
      const match = question.match(keyword);
      return match ? total + 1000 + match[0].length : total;
    }, 0);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }

  if (best) return best.answer + formatHints(best.hints);
  return OFF_TOPIC_REPLY + formatHints(roomHints);
}

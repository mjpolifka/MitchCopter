"use strict"

let sc2kparser = {};
let buildingNames = 
  {
    "00": "Clear terrain",
    "01": "Rubble",
    "02": "Rubble",
    "03": "Rubble",
    "04": "Rubble",
    "05": "Radioactive waste",
    "06": "Trees",
    "07": "Trees",
    "08": "Trees",
    "09": "Trees",
    "0A": "Trees",
    "0B": "Trees",
    "0C": "Trees",
    "0D": "Small park",
    "0E": "Power lines",
    "0F": "Power lines",
    "10": "Power lines",
    "11": "Power lines",
    "12": "Power lines",
    "13": "Power lines",
    "14": "Power lines",
    "15": "Power lines",
    "16": "Power lines",
    "17": "Power lines",
    "18": "Power lines",
    "19": "Power lines",
    "1A": "Power lines",
    "1B": "Power lines",
    "1C": "Power lines",
    "1D": "Road",
    "1E": "Road",
    "1F": "Road",
    "20": "Road",
    "21": "Road",
    "22": "Road",
    "23": "Road",
    "24": "Road",
    "25": "Road",
    "26": "Road",
    "27": "Road",
    "28": "Road",
    "29": "Road",
    "2A": "Road",
    "2B": "Road",
    "2C": "Rails",
    "2D": "Rails",
    "2E": "Rails",
    "30": "Rails",
    "31": "Rails",
    "32": "Rails",
    "33": "Rails",
    "34": "Rails",
    "35": "Rails",
    "36": "Rails",
    "37": "Rails",
    "38": "Rails",
    "39": "Rails",
    "3A": "Rails",
    "3B": "Rails",
    "3C": "Rails",
    "3D": "Rails",
    "3E": "Rails",
    "3F": "Tunnel entrance",
    "40": "Tunnel entrance",
    "41": "Tunnel entrance",
    "42": "Tunnel entrance",
    "43": "Road / power lines",
    "44": "Road / power lines",
    "45": "Road / rails",
    "46": "Road / rails",
    "47": "Rails / power lines",
    "48": "Rails / power lines",
    "49": "Highway",
    "4A": "Highway",
    "4B": "Highway / road",
    "4C": "Highway / road",
    "4D": "Highway / rails",
    "4E": "Highway / rails",
    "4F": "Highway / power lines",
    "50": "Highway / power lines",
    "51": "Suspension bridge",
    "52": "Suspension bridge",
    "53": "Suspension bridge",
    "54": "Suspension bridge",
    "55": "Suspension bridge",
    "56": "Road bridge",
    "57": "Road bridge",
    "58": "Road bridge",
    "59": "Road bridge",
    "5A": "Rail bridge",
    "5B": "Rail bridge",
    "5C": "Elevated power lines",
    "5D": "Onramp",
    "5E": "Onramp",
    "5F": "Onramp",
    "60": "Onramp",
    "61": "Highway",
    "62": "Highway",
    "63": "Highway",
    "64": "Highway",
    "65": "Highway",
    "66": "Highway",
    "67": "Highway",
    "68": "Highway",
    "69": "Cloverleaf intersection",
    "6A": "Highway bridges",
    "6B": "Highway bridges",
    "6C": "Subway / rails",
    "6D": "Subway / rails",
    "6E": "Subway / rails",
    "6F": "Subway / rails",
    "70": "Lower-class homes",
    "71": "Lower-class homes",
    "72": "Lower-class homes",
    "73": "Lower-class homes",
    "74": "Middle-class homes",
    "75": "Middle-class homes",
    "76": "Middle-class homes",
    "77": "Middle-class homes",
    "78": "Luxury homes",
    "79": "Luxury homes",
    "7A": "Luxury homes",
    "7B": "Luxury homes",
    "7C": "Gas station",
    "7D": "Bed & breakfast inn",
    "7E": "Convenience store",
    "7F": "Gas station",
    "80": "Small office building",
    "81": "Office building",
    "82": "Warehouse",
    "83": "Cassidy's Toy Store",
    "84": "Warehouse",
    "85": "Chemical storage",
    "86": "Warehouse",
    "87": "Industrial substation",
    "88": "Construction",
    "89": "Construction",
    "8A": "Abandoned building",
    "8B": "Abandoned building",
    "8C": "Cheap apartments",
    "8D": "Apartments",
    "8E": "Apartments",
    "8F": "Nice apartments",
    "90": "Nice apartments",
    "91": "Condominium",
    "92": "Condominium",
    "93": "Condominium",
    "94": "Shopping center",
    "95": "Grocery store",
    "96": "Office building",
    "97": "Resort hotel",
    "98": "Office building",
    "99": "Office / Retail",
    "9A": "Office building",
    "9B": "Office building",
    "9C": "Office building",
    "9D": "Office building",
    "9E": "Warehouse",
    "9F": "Chemical processing",
    "A0": "Factory",
    "A1": "Factory",
    "A2": "Factory",
    "A3": "Factory",
    "A4": "Factory",
    "A5": "Factory",
    "A6": "Construction",
    "A7": "Construction",
    "A8": "Construction",
    "A9": "Construction",
    "AA": "Abandoned building",
    "AB": "Abandoned building",
    "AC": "Abandoned building",
    "AD": "Abandoned building",
    "AE": "Large apartment building",
    "AF": "Large apartment building",
    "B0": "Condominium",
    "B1": "Condominium",
    "B2": "Office park",
    "B3": "Office tower",
    "B4": "Mini-mall",
    "B5": "Theater square",
    "B6": "Drive-in theater",
    "B7": "Office tower",
    "B8": "Office tower",
    "B9": "Parking lot",
    "BA": "Historic office building",
    "BB": "Corporate headquarters",
    "BC": "Chemical processing",
    "BD": "Large factory",
    "BE": "Industrial thingamajig",
    "BF": "Factory",
    "C0": "Large warehouse",
    "C1": "Warehouse",
    "C2": "Construction",
    "C3": "Construction",
    "C4": "Abandoned building",
    "C5": "Abandoned building",
    "C6": "Hydroelectric power",
    "C7": "Hydroelectric power",
    "C8": "Wind power",
    "C9": "Natural gas power plant",
    "CA": "Oil power plant",
    "CB": "Nuclear power plant",
    "CC": "Solar power plant",
    "CD": "Microwave power receiver",
    "CE": "Fusion power plant",
    "CF": "Coal power plant",
    "D0": "City hall",
    "D1": "Hospital",
    "D2": "Police station",
    "D3": "Fire station",
    "D4": "Museum",
    "D5": "Park (big)",
    "D6": "School",
    "D7": "Stadium",
    "D8": "Prison",
    "D9": "College",
    "DA": "Zoo",
    "DB": "Statue",
    "DC": "Water pump",
    "DD": "Runway",
    "DE": "Runway",
    "DF": "Pier",
    "E0": "Crane",
    "E1": "Control tower",
    "E2": "Control tower",
    "E3": "Seaport warehouse",
    "E4": "Airport building",
    "E5": "Airport building",
    "E6": "Tarmac",
    "E7": "F-15b",
    "E8": "Hangar",
    "E9": "Subway station",
    "EA": "Radar",
    "EB": "Water tower",
    "EC": "Bus station",
    "ED": "Rail station",
    "EE": "Parking lot",
    "EF": "Parking lot",
    "F0": "Loading bay",
    "F1": "Top secret",
    "F2": "Cargo yard",
    "F3": "Mayor's house",
    "F4": "Water treatment plant",
    "F5": "Library",
    "F6": "Hangar",
    "F7": "Church",
    "F8": "Marina",
    "F9": "Missile silo",
    "FA": "Desalination plant",
    "FB": "Plymouth arcology",
    "FC": "Forest arcology",
    "FD": "Darco arcology",
    "FE": "Launch arcology",
    "FF": "Braun Llama-dome"
  };

/*
The data in most SimCity segments is compressed using a form of run-length
encoding.  When this is done, the data in the segment consists of a series
of chunks of two kinds.  The first kind of chunk has first byte from 1 to
127;  in this case the first byte is a count telling how many data bytes
follow.  The second kind of chunk has first byte from 129 to 255.  In this
case, if you subtract 127 from the first byte, you get a count telling how
many times the following single data byte is repeated.  Chunks with first
byte 0 or 128 never seem to occur.
*/
sc2kparser.decompressSegment = function(bytes) {
  let output = [];
  let dataCount = 0;

  for(let i=0; i<bytes.length; i++) {
    if(dataCount > 0) {
      output.push(bytes[i]);
      dataCount -= 1;
      continue;
    }

    if(bytes[i] < 128) {
      // data bytes
      dataCount = bytes[i];
    } else {
      // run-length encoded byte
      let repeatCount = bytes[i] - 127;
      let repeated = bytes[i+1];
      for(let i=0; i<repeatCount; i++) {
        output.push(repeated);
      }
      // skip the next byte
      i += 1;
    }
  }

  return Uint8Array.from(output);
};

let alreadyDecompressedSegments = {
  'ALTM': true,
  'CNAM': true
};

// split segments into a hash indexed by segment title
sc2kparser.splitIntoSegments = function(rest) {
  let segments = {};
  while(rest.length > 0) {
    let segmentTitle = Array.prototype.map.call(rest.subarray(0, 4), x => String.fromCharCode(x)).join('');
    let lengthBytes = rest.subarray(4, 8);
    let segmentLength = new DataView(lengthBytes.buffer).getUint32(lengthBytes.byteOffset);
    let segmentContent = rest.subarray(8, 8+segmentLength);
    if(!alreadyDecompressedSegments[segmentTitle]) {
      segmentContent = sc2kparser.decompressSegment(segmentContent);
    }
    segments[segmentTitle] = segmentContent;
    rest = rest.subarray(8+segmentLength);
  }
  return segments;
};

// slopes define the relative heights of corners from left to right
// i.e.: [0,0,1,1] =>
// 0   0   top
//
// 1   1   bottom
// which is a slope where the top side is at this tile's altitude, and the bottom
// side is at the next altitude level
let xterSlopeMap = {
  0x0: [0,0,0,0],
  0x1: [1,1,0,0],
  0x2: [0,1,0,1],
  0x3: [0,0,1,1],
  0x4: [1,0,1,0],
  0x5: [1,1,0,1],
  0x6: [0,1,1,1],
  0x7: [1,0,1,1],
  0x8: [1,1,1,0],
  0x9: [0,1,0,0],
  0xA: [0,0,0,1],
  0xB: [0,0,1,0],
  0xC: [1,0,0,0],
  0xD: [1,1,1,1]
};

// NOTE: surf. water documetation inconsistency
// denotes which sides have land
//     0
//   .___.
// 1 |   | 2
//   |___|
//     3
let xterWaterMap = {
  0x0: [1,0,0,1], // left-right open canal
  0x1: [0,1,1,0], // top-bottom open canal
  0x2: [1,1,0,1], // right open bay
  0x3: [1,0,1,1], // left open bay
  0x4: [0,1,1,1], // top open bay
  0x5: [1,1,1,0]  // bottom open bay
};

let waterLevels = {
  0x0: "dry",
  0x1: "submerged",
  0x2: "shore",
  0x3: "surface",
  0x4: "waterfall"
};

sc2kparser.segmentHandlers = {
  'ALTM': (data, struct) => {
    // NOTE: documentation is weak on this segment
    // NOTE: uses DataView instead of typed array, because we need non-aligned access to 16bit ints
    let view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    for(let i=0; i<data.byteLength/2; i++) {
      let square = view.getUint16(i*2);
      let altitude = (square & 0x001F) * 50;
      struct.tiles[i].alt = altitude;
      struct.tiles[i].water = (square & 0x0080) !== 0;
    }
  },
  'CNAM': (data, struct) => {
    let view = new Uint8Array(data);
    let len = view[0] & 0x3F; // limit to 32
    let strDat = view.subarray(1,1+len);
    struct.cityName = Array.prototype.map.call(strDat, x => String.fromCharCode(x)).join('');
  },
  'XBIT': (data, struct) => {
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      let tile = struct.tiles[i];
      tile.saltwater = (square & 0x01) !== 0;
      //tile.unknown = (square & 0x02) !== 0;
      tile.watercover = (square & 0x04) !== 0;
      //tile.unknown = (square & 0x08) !== 0;
      tile.watersupplied = (square & 0x10) !== 0;
      tile.piped = (square & 0x20) !== 0;
      tile.powersupplied = (square & 0x40) !== 0;
      tile.conductive = (square & 0x80) !== 0;
    });
  },
  'XBLD': (data, struct) => {
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      struct.tiles[i].building = square;
      struct.tiles[i].buildingName = buildingNames[square.toString(16).toUpperCase()];
    });
  },
  'XTER': (data, struct) => {
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      let terrain = {};
      if(square < 0x3E) {
        let slope = square & 0x0F;
        let wetness = (square & 0xF0) >> 4;
        terrain.slope = xterSlopeMap[slope];
        terrain.waterlevel = waterLevels[wetness];
      } else if(square === 0x3E) {
        terrain.slope = xterSlopeMap[0];
        terrain.waterlevel = waterLevels[0x4];
      } else if(square >= 0x40) {
        let surfaceWater = square & 0x0F;
        terrain.slope = xterSlopeMap[0];
        terrain.surfaceWater = xterWaterMap[surfaceWater];
        terrain.waterlevel = waterLevels[0x3];
      }
      struct.tiles[i].terrain = terrain;
    });
  },
  'XUND': (data, struct) => {
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      let underground = {};
      if(square < 0x1E) {
        let slope = square & 0x0F;
        underground.slope = xterSlopeMap[slope];
        if((square & 0xF0) === 0x00) {
          underground.subway = true;
        } else if(((square & 0xF0) === 0x10) && (square < 0x1F)) {
          underground.pipes = true;
        }
      } else if((square === 0x1F) || (square === 0x20)) {
        underground.subway = true;
        underground.pipes = true;
        underground.slope = xterSlopeMap[0x0];
        underground.subwayLeftRight = square === 0x1F;
      } else if(square === 0x23) {
        underground.station = true;
        underground.slope = xterSlopeMap[0x0];
      }
      struct.tiles[i].underground = underground;
    });
  },
  'XZON': (data, struct) => {
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      let zone = {};
      zone.topLeft = (square & 0x80) !== 0;
      zone.topRight = (square & 0x10) !== 0;
      zone.bottomLeft = (square & 0x40) !== 0;
      zone.bottomRight = (square & 0x20) !== 0;
      zone.type = square & 0x0F;
      struct.tiles[i].zone = zone;
    });
  },
  'XTXT': (data, struct) => {
    // idk
    let view = new Uint8Array(data);
    view.forEach((square, i) => {
      if(square !== 0) {
        struct.tiles[i].sign = square;
      }
    });
  },
  'XLAB': (data, struct) => {
    // labels (1 byte len + 24 byte string)
    let view = new Uint8Array(data);
    let labels = [];
    for(let i=0; i<256; i++) {
      let labelPos = i*25;
      let labelLength = Math.max(0, Math.min(view[labelPos], 24));
      let labelData = view.subarray(labelPos+1, labelPos+1+labelLength);
      labels[i] = Array.prototype.map.call(labelData, x => String.fromCharCode(x)).join('');
    }
    struct.labels = labels;
  },
  'MISC': (data, struct) => {
    let view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    struct.first = view.getInt32(0);
    struct.founded = view.getInt32(3*4);
    struct.daysElapsed = view.getInt32(4*4);
    struct.money = view.getInt32(5*4);
    struct.population = view.getInt32(20*4);
    // TODO: classify rest of misc data
  }
  // TODO: XMIC, XTHG, XGRP, XPLC, XFIR, XPOP, XROG, XPLT, XVAL, XCRM, XTRF
};

// decompress and interpret bytes into a combined tiles format
sc2kparser.toVerboseFormat = function(segments) {
  let struct = {};
  struct.tiles = [];
  for(let i=0; i<128*128; i++) {
    struct.tiles.push({});
  }

  Object.keys(segments).forEach((segmentTitle) => {
    let data = segments[segmentTitle];
    let handler = sc2kparser.segmentHandlers[segmentTitle];
    if(handler) {
      handler(data, struct);
    }
  });
  return struct;
};

// bytes -> file segments decompressed
sc2kparser.parse = function(bytes, options) {
  let buffer = new Uint8Array(bytes);
  let fileHeader = buffer.subarray(0, 12);
  let rest = buffer.subarray(12);
  let segments = sc2kparser.splitIntoSegments(rest);
  let struct = sc2kparser.toVerboseFormat(segments);
  return struct;
};

// check header bytes
sc2kparser.isSimCity2000SaveFile = function(bytes) {
  // check IFF header
  if(bytes[0] !== 0x46 ||
     bytes[1] !== 0x4F ||
     bytes[2] !== 0x52 ||
     bytes[3] !== 0x4D) {
    return false;
  }

  // check sc2k header
  if(bytes[8] !== 0x53 ||
     bytes[9] !== 0x43 ||
     bytes[10] !== 0x44 ||
     bytes[11] !== 0x48) {
    return false;
  }

  return true;
}
export default sc2kparser;

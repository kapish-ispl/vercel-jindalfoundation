'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

const LABEL_MAPS = {
  odisha: 'https://d2lptvt2jijg6f.cloudfront.net/document/113/1787385219_odisha1.png',
  chhattisgarh: 'https://d2lptvt2jijg6f.cloudfront.net/document/113/1787385219_chattishgard1.png',
  jharkhand: 'https://d2lptvt2jijg6f.cloudfront.net/document/113/1787385219_jharkhand1.png',
  andhrapradesh: 'https://d2lptvt2jijg6f.cloudfront.net/document/113/1787385219_andra-pradesh1.png',
  maharastra: 'https://d2lptvt2jijg6f.cloudfront.net/document/113/1787590963_maharastra-map2.png'
};

interface LocationStat {
  location: string;
  gramPanchayat: number;
  village: number;
}

interface VillageData {
  name: string;
  gpName: string;
  block: string;
}

interface LocationVillages {
  [location: string]: VillageData[];
}

interface StateOperationsData {
  id: string;
  stateName: string;
  mapImage: string;
  locations: LocationStat[];
}

const operationsData: StateOperationsData[] = [
  {
    id: 'odisha',
    stateName: 'Odisha',
    mapImage: LABEL_MAPS.odisha,
    locations: [
      { location: 'ANUGOLA', gramPanchayat: 17, village: 58 },
      { location: 'BARBIL', gramPanchayat: 4, village: 23 },
      { location: 'TENSA', gramPanchayat: 3, village: 10 },
      { location: 'KASIA', gramPanchayat: 2, village: 10 },
      { location: 'ROIDA', gramPanchayat: 1, village: 3 },
    ],
  },
  {
    id: 'chhattisgarh',
    stateName: 'Chhattisgarh',
    mapImage: LABEL_MAPS.chhattisgarh,
    locations: [
      { location: 'RAIGARH', gramPanchayat: 33, village: 46 },
      { location: 'TAMNAR', gramPanchayat: 69, village: 80 },
    ],
  },
  {
    id: 'jharkhand',
    stateName: 'Jharkhand',
    mapImage: LABEL_MAPS.jharkhand,
    locations: [
      { location: 'PATRATU', gramPanchayat: 7, village: 16 },
    ],
  },
  {
    id: 'andhrapradesh',
    stateName: 'Andhra Pradesh',
    mapImage: LABEL_MAPS.andhrapradesh,
    locations: [
      { location: 'SIMHAPURI (NELLORE)', gramPanchayat: 5, village: 17 }
    ],
  },
  {
    id: 'maharastra',
    stateName: 'Maharastra',
    mapImage: LABEL_MAPS.maharastra,
    locations: [
      { location: 'SHIRPUR', gramPanchayat: 14, village: 14 }
    ],
  },
];

// Village data based on client's sheet
const villageData: LocationVillages = {
  'BARBIL': [
    { name: 'Sialijoda', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Gobardhanpur', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Kitabeda', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Deojhar', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Mahadevnasa', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Kuldum', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Thakurani', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Murga Mahadev', gpName: 'Deojhar', block: 'Joda' },
    { name: 'Dampur', gpName: 'Kandra', block: 'Joda' },
    { name: 'Kandra', gpName: 'Kandra', block: 'Joda' },
    { name: 'Kanhupur', gpName: 'Kandra', block: 'Joda' },
    { name: 'Jugulidhar', gpName: 'Kandra', block: 'Joda' },
    { name: 'Bileipada', gpName: 'Birkala', block: 'Joda' },
    { name: 'Bhagalpur', gpName: 'Birkala', block: 'Joda' },
    { name: 'Balita', gpName: 'Birkala', block: 'Joda' },
    { name: 'Lahanda', gpName: 'Birkala', block: 'Joda' },
    { name: 'Birkala', gpName: 'Birkala', block: 'Joda' },
    { name: 'Govindpur', gpName: 'Birkala', block: 'Joda' },
    { name: 'Anseikala', gpName: 'Anseikala', block: 'Joda' },
    { name: 'Kolhahundula', gpName: 'Anseikala', block: 'Joda' },
    { name: 'Panchananpur', gpName: 'Anseikala', block: 'Joda' },
    { name: 'Jamukundia', gpName: 'Anseikala', block: 'Joda' },
    { name: 'Nizam Sahi', gpName: 'Anseikala', block: 'Joda' },
    { name: 'Sanbadbil', gpName: 'Anseikala', block: 'Joda' },
  ],
  'ANUGOLA': [
    { name: 'Parang', gpName: 'Parang', block: 'Chhendipada' },
    { name: 'Bhubanpur', gpName: 'Parang', block: 'Chhendipada' },
    { name: 'Ramadiha', gpName: 'Parang', block: 'Chhendipada' },
    { name: 'Mukundapur', gpName: 'Parang', block: 'Chhendipada' },
    { name: 'Pitabali', gpName: 'Parang', block: 'Chhendipada' },
    { name: 'Nisha', gpName: 'Nisha', block: 'Chhendipada' },
    { name: 'Kaliakata', gpName: 'Nisha', block: 'Chhendipada' },
    { name: 'Balichandrapur', gpName: 'Nisha', block: 'Chhendipada' },
    { name: 'Malibrahmani', gpName: 'Nisha', block: 'Chhendipada' },
    { name: 'Kankarei', gpName: 'Kankarei', block: 'Chhendipada' },
    { name: 'Pirakhaman', gpName: 'Kankarei', block: 'Chhendipada' },
    { name: 'Chhotabereni', gpName: 'Kankarei', block: 'Chhendipada' },
    { name: 'Natada', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'Ambapal', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'Bethianali', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'Badajharan', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'Mahitala (Bada mahitala & Sana Mahitala)', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'New Basudevpur', gpName: 'Natada', block: 'Chhendipada' },
    { name: 'Tukuda', gpName: 'Tukuda', block: 'Chhendipada' },
    { name: 'Sadanandapur', gpName: 'Tukuda', block: 'Chhendipada' },
    { name: 'Odakapa', gpName: 'Tukuda', block: 'Chhendipada' },
    { name: 'Raijharan', gpName: 'Raijharan', block: 'Chhendipada' },
    { name: 'Golagadia', gpName: 'Raijharan', block: 'Chhendipada' },
    { name: 'Kaunsidhipa', gpName: 'Raijharan', block: 'Chhendipada' },
    { name: 'Similisahi', gpName: 'Koshala', block: 'Chhendipada' },
    { name: 'Balinali', gpName: 'Brahmanbil', block: 'Chhendipada' },
    { name: 'Phuljhari', gpName: 'Kukurpeta', block: 'Chhendipada' },
    { name: 'Jarasingha', gpName: 'Jarasigha', block: 'Banarpal' },
    { name: 'Old Jarasingha', gpName: 'Jarasigha', block: 'Banarpal' },
    { name: 'Akrurabahal', gpName: 'Jarasigha', block: 'Banarpal' },
    { name: 'Benagadia', gpName: 'Benagadia', block: 'Banarpal' },
    { name: 'Majhika', gpName: 'Benagadia', block: 'Banarpal' },
    { name: 'Bedasar', gpName: 'Benagadia', block: 'Banarpal' },
    { name: 'Sanakerjang', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Golabandha', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Dabardhua', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Pathuria', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Beherabhuin', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Krushnachadrapur', gpName: 'Sanakerjang', block: 'Banarpal' },
    { name: 'Badakerjang', gpName: 'Badakerjang', block: 'Banarpal' },
    { name: 'Badakerjang Jungle', gpName: 'Badakerjang', block: 'Banarpal' },
    { name: 'Jamunda', gpName: 'Badakerjang', block: 'Banarpal' },
    { name: 'Jamunda Jungle', gpName: 'Badakerjang', block: 'Banarpal' },
    { name: 'Sanajamunda', gpName: 'Badakerjang', block: 'Banarpal' },
    { name: 'Jarada', gpName: 'Jarada', block: 'Banarpal' },
    { name: 'Paripara', gpName: 'Jarada', block: 'Banarpal' },
    { name: 'Santarapur', gpName: 'Santarapur', block: 'Banarpal' },
    { name: 'Dudhiabeda', gpName: 'Santarapur', block: 'Banarpal' },
    { name: 'Maratira', gpName: 'Santarapur', block: 'Banarpal' },
    { name: 'Amantapur', gpName: 'Santarapur', block: 'Banarpal' },
    { name: 'Tubey', gpName: 'Tubey', block: 'Banarpal' },
    { name: 'Kulei', gpName: 'Tubey', block: 'Banarpal' },
    { name: 'Derajang', gpName: 'Tubey', block: 'Banarpal' },
    { name: 'Jukub', gpName: 'Tubey', block: 'Banarpal' },
    { name: 'Jamunali', gpName: 'Jamunali', block: 'Banarpal' },
    { name: 'Kuio', gpName: 'Jamunali', block: 'Banarpal' },
    { name: 'Karadatikar', gpName: 'Jamunali', block: 'Banarpal' },
    { name: 'Subarnapur', gpName: 'Jamunali', block: 'Banarpal' },
  ],
  'TENSA': [
    { name: 'Zero Point', gpName: 'Tensa', block: 'Koida' },
    { name: 'Tantra', gpName: 'Tensa', block: 'Koida' },
    { name: 'Raikela', gpName: 'Dengula', block: 'Koida' },
    { name: 'Bandal', gpName: 'Dengula', block: 'Koida' },
    { name: 'Bahamba', gpName: 'Tensa', block: 'Koida' },
    { name: 'Fuljhar', gpName: 'Tensa', block: 'Koida' },
    { name: 'Dengula', gpName: 'Dengula', block: 'Koida' },
    { name: 'Barsuan', gpName: 'Sashyakala', block: 'Lahunipara' },
    { name: 'Sashyakala', gpName: 'Sashyakala', block: 'Lahunipara' },
    { name: 'Tensa Basti', gpName: 'Tensa', block: 'Koida' },
  ],
  'KASIA': [
    { name: 'Kasia (Ka)', gpName: 'Serenda', block: 'Joda' },
    { name: 'Serenda', gpName: 'Serenda', block: 'Joda' },
    { name: 'Jagdasahi', gpName: 'Serenda', block: 'Joda' },
    { name: 'Soyabali', gpName: 'Serenda', block: 'Joda' },
    { name: 'Raika', gpName: 'Serenda', block: 'Joda' },
    { name: 'Kasia Kha', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Bhadrasahi', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Jhadgaon', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Bhusugaon', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Tonto', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Fulbadi', gpName: 'Bhadrasahi', block: 'Joda' },
    { name: 'Sankhajhar', gpName: 'Karakhendara', block: 'Joda' },
  ],
  'ROIDA': [
    { name: 'Bhuyan Roida', gpName: 'Bhuyan Roida', block: 'Joda' },
    { name: 'Kalha Roida', gpName: 'Bhuyan Roida', block: 'Joda' },
    { name: 'Kundurpani', gpName: 'Bhuyan Roida', block: 'Joda' },
  ],
  'RAIGARH': [
    { name: 'Patrapali', gpName: 'Nagar Nigam Ward 44', block: 'Raigarh' },
    { name: 'Khairpur', gpName: 'Khairpur', block: 'Raigarh' },
    { name: 'Tipakhol', gpName: 'Khairpur', block: 'Raigarh' },
    { name: 'Bhgawanpur', gpName: 'Nagar Nigam Ward 46', block: 'Raigarh' },
    { name: 'Barmuda', gpName: 'Nagar Nigam Ward 43', block: 'Raigarh' },
    { name: 'Saraipali', gpName: 'Nagar Nigam Ward 43', block: 'Raigarh' },
    { name: 'Gorkha', gpName: 'Nagar Nigam Ward 43', block: 'Raigarh' },
    { name: 'Chiraipani', gpName: 'Chiraipani', block: 'Raigarh' },
    { name: 'Kirorimal nagar', gpName: 'Nagar Panchayat', block: 'Raigarh' },
    { name: 'Uchbhitti', gpName: 'Uchbhitti', block: 'Raigarh' },
    { name: 'Parsada', gpName: 'Parsada', block: 'Raigarh' },
    { name: 'Muraripali', gpName: 'Parsada', block: 'Raigarh' },
    { name: 'Dongadakhel', gpName: 'Parsada', block: 'Raigarh' },
    { name: 'Kerajhar', gpName: 'Kerajhar', block: 'Raigarh' },
    { name: 'Kosampali', gpName: 'Kosampali', block: 'Raigarh' },
    { name: 'Dhanagar', gpName: 'Dhanagar', block: 'Raigarh' },
    { name: 'Kusmura', gpName: 'Kusmura', block: 'Raigarh' },
    { name: 'Jampali', gpName: 'Jampali', block: 'Raigarh' },
    { name: 'Jorapali', gpName: 'Jorapali', block: 'Raigarh' },
    { name: 'Gejamuda', gpName: 'Gejamuda', block: 'Raigarh' },
    { name: 'Baghanpur', gpName: 'Baghanpur', block: 'Raigarh' },
    { name: 'Banhar', gpName: 'Baghanpur', block: 'Raigarh' },
    { name: 'Kalmi', gpName: 'Kalmi', block: 'Raigarh' },
    { name: 'Kosamnara', gpName: 'Kosamnara', block: 'Raigarh' },
    { name: 'Balpur', gpName: 'Balpur', block: 'Dabhra' },
    { name: 'Netnagar', gpName: 'Netnagar', block: 'Pusor' },
    { name: 'Ektal', gpName: 'Ektal', block: 'Pusor' },
    { name: 'Attarmuda', gpName: 'Bade Attarmuda', block: 'Raigarh' },
    { name: 'Bodhatikra', gpName: 'Gadh Umariya', block: 'Raigarh' },
    { name: 'Nawapali (Boirdih)', gpName: 'Nawapali', block: 'Pusor' },
    { name: 'Malda', gpName: 'Malda', block: 'Pusor' },
    { name: 'Samaruma', gpName: 'Patkipahri', block: 'Gharghoda' },
    { name: 'Tumidih', gpName: 'Tumidih', block: 'Gharghoda' },
    { name: 'Punjipathra', gpName: 'Punjipathra', block: 'Gharghoda' },
    { name: 'Chilhathi', gpName: 'Chilhati', block: 'Masturi' },
    { name: 'Sodadih', gpName: 'Godadih', block: 'Masturi' },
    { name: 'Godadih', gpName: 'Godadih', block: 'Masturi' },
    { name: 'Loharsi', gpName: 'Loharsi', block: 'Masturi' },
    { name: 'Dongamuha', gpName: 'Sarasmal', block: 'Tamnar' },
    { name: 'Baljor', gpName: 'kondkel', block: 'Tamnar' },
    { name: 'Kondkel', gpName: 'kondkel', block: 'Tamnar' },
    { name: 'Dhaurabhata', gpName: 'Dhaurabhata', block: 'Tamnar' },
    { name: 'Gare', gpName: 'Gare', block: 'Tamnar' },
    { name: 'Karwahi', gpName: 'Khamariya', block: 'Tamnar' },
    { name: 'Lamdarha', gpName: 'Gare', block: 'Tamnar' },
    { name: 'Khamariya', gpName: 'Khamariya', block: 'Tamnar' },
    { name: 'Saraitola', gpName: 'Saraitola', block: 'Tamnar' },
  ],
  'TAMNAR': [
    { name: 'Basanpali', gpName: 'Basanpali', block: 'Tamnar' },
    { name: 'Ghodi', gpName: 'Godhi', block: 'Tamnar' },
    { name: 'Kachkoba', gpName: 'Kachkoba', block: 'Tamnar' },
    { name: 'Navapara (Kachkoba)', gpName: 'Kachkoba', block: 'Tamnar' },
    { name: 'Aamghat', gpName: 'Aamghat', block: 'Tamnar' },
    { name: 'Jhingol', gpName: 'Aamghat', block: 'Tamnar' },
    { name: 'Padkipehari (Amaghat)', gpName: 'Aamghat', block: 'Tamnar' },
    { name: 'Laaldeepa, Dandri (Amaghat)', gpName: 'Aamghat', block: 'Tamnar' },
    { name: 'Tamnar', gpName: 'Tamnar', block: 'Tamnar' },
    { name: 'Indranagar', gpName: 'Basanpali', block: 'Tamnar' },
    { name: 'Mahloi', gpName: 'Mahloi', block: 'Tamnar' },
    { name: 'Jhargaon (Mahloi)', gpName: 'Mahloi', block: 'Tamnar' },
    { name: 'Patrapara (Mahloi)', gpName: 'Mahloi', block: 'Tamnar' },
    { name: 'Budhiya', gpName: 'Budhiya', block: 'Tamnar' },
    { name: 'Devgaon', gpName: 'Devgaon', block: 'Tamnar' },
    { name: 'Salihabhata', gpName: 'Salihabhata', block: 'Tamnar' },
    { name: 'Majhapara', gpName: 'Salihabhata', block: 'Tamnar' },
    { name: 'Regaon', gpName: 'Regaon', block: 'Tamnar' },
    { name: 'Pata', gpName: 'Pata', block: 'Tamnar' },
    { name: 'Bhandhapali', gpName: 'Pata', block: 'Tamnar' },
    { name: 'Dolesara', gpName: 'Dolesara', block: 'Tamnar' },
    { name: 'Kathrapali', gpName: 'Dolesara', block: 'Tamnar' },
    { name: 'Chitwahi', gpName: 'Chitwahi', block: 'Tamnar' },
    { name: 'Saraideepa (Chitwahi)', gpName: 'Chitwahi', block: 'Tamnar' },
    { name: 'Rodopali', gpName: 'Rodopali', block: 'Tamnar' },
    { name: 'Kunjemura', gpName: 'Kunjemura', block: 'Tamnar' },
    { name: 'Mudhinar', gpName: 'Jaraikela', block: 'Tamnar' },
    { name: 'Jaraikela', gpName: 'Jaraikela', block: 'Tamnar' },
    { name: 'Padigaon', gpName: 'Padigaon', block: 'Tamnar' },
    { name: 'KantaJharia', gpName: 'Kasdol', block: 'Tamnar' },
    { name: 'Kasdol', gpName: 'Kasdol', block: 'Tamnar' },
    { name: 'Salihari', gpName: 'Kasdol', block: 'Tamnar' },
    { name: 'Charratangar', gpName: 'Charratangar', block: 'Tamnar' },
    { name: 'Tibhaudeeh', gpName: 'Charratangar', block: 'Tamnar' },
    { name: 'Suhai–Charratangar', gpName: 'Charratangar', block: 'Tamnar' },
    { name: 'Dokarbuda', gpName: 'Charratangar', block: 'Tamnar' },
    { name: 'Gudgud', gpName: 'Rabo', block: 'Tamnar' },
    { name: 'Amapali', gpName: 'Rabo', block: 'Tamnar' },
    { name: 'Rabo', gpName: 'Rabo', block: 'Tamnar' },
    { name: 'Dehridih', gpName: 'Dehridih', block: 'Tamnar' },
    { name: 'Bilaskhar', gpName: 'Dehridih', block: 'Tamnar' },
    { name: 'Pakadrah', gpName: 'Dehridih', block: 'Tamnar' },
    { name: 'Gadgaon', gpName: 'Gadgaon', block: 'Tamnar' },
    { name: 'Sumda', gpName: 'Amlidih', block: 'Tamnar' },
    { name: 'Patrapali', gpName: 'Mahuapali', block: 'Tamnar' },
    { name: 'Mahuapali', gpName: 'Mahuapali', block: 'Tamnar' },
    { name: 'Libra', gpName: 'Libra', block: 'Tamnar' },
    { name: 'Amgoan', gpName: 'Aamgaon', block: 'Tamnar' },
    { name: 'Tapranga', gpName: 'Dhanurabhantha', block: 'Tamnar' },
    { name: 'Janjgeer', gpName: 'Janjgir', block: 'Tamnar' },
    { name: 'Nagramuda', gpName: 'Janjgir', block: 'Tamnar' },
    { name: 'Dongamauha', gpName: 'Sarasmal', block: 'Tamnar' },
    { name: 'Kosampali', gpName: 'Sarasmal', block: 'Tamnar' },
    { name: 'Sarasmal', gpName: 'Sarasmal', block: 'Tamnar' },
    { name: 'Kondkel', gpName: 'Kondkel', block: 'Tamnar' },
    { name: 'Beljor', gpName: 'Kondkel', block: 'Tamnar' },
    { name: 'Budia', gpName: 'Budia', block: 'Tamnar' },
    { name: 'Jharadeeh', gpName: 'Hinjahr', block: 'Tamnar' },
    { name: 'Bagwadi', gpName: 'Jhinkabahal', block: 'Tamnar' },
    { name: 'Lamdaraha', gpName: 'Gare', block: 'Tamnar' },
    { name: 'Dhaurabanta', gpName: 'Dhanurabhantha', block: 'Tamnar' },
    { name: 'Khuruslenga', gpName: 'Khuruslenga', block: 'Tamnar' },
    { name: 'Samkera', gpName: 'Samkera', block: 'Tamnar' },
    { name: 'Raipara', gpName: 'Samkera', block: 'Tamnar' },
    { name: 'Rawan guda', gpName: 'Aamgaon', block: 'Tamnar' },
    { name: 'Jhinkabahal', gpName: 'Jhinkabahal', block: 'Tamnar' },
    { name: 'Tilaipara', gpName: 'Samkera', block: 'Tamnar' },
    { name: 'Bijna', gpName: 'Bijna', block: 'Tamnar' },
    { name: 'Tangarghat', gpName: 'Tangarghat', block: 'Tamnar' },
    { name: 'Jharna', gpName: 'Jharna', block: 'Tamnar' },
    { name: 'Tehlirampur', gpName: 'Tihlirampur', block: 'Tamnar' },
    { name: 'Banai', gpName: 'Banai', block: 'Tamnar' },
    { name: 'Bhalumuda', gpName: 'Rodopali', block: 'Tamnar' },
    { name: 'Chiramuda', gpName: 'Banai', block: 'Tamnar' },
    { name: 'Kerakhol', gpName: 'Noondarha', block: 'Tamnar' },
    { name: 'Dholnara', gpName: 'Bazarmuda', block: 'Tamnar' },
    { name: 'Kolam', gpName: 'Chitwani', block: 'Tamnar' },
    { name: 'Nundaraha', gpName: 'Noondarha', block: 'Tamnar' },
    { name: 'Auraimuda', gpName: 'Auraimuda', block: 'Tamnar' },
    { name: 'Barkaspali', gpName: 'Barkaspali', block: 'Tamnar' },
    { name: 'Charbhantha', gpName: 'Charbhantha', block: 'Gharghoda' },
    { name: 'Muskura', gpName: 'Kotrimal', block: 'Gharghoda' },
    { name: 'Kasaiya', gpName: 'Gharghoda- Ward no 1', block: 'Gharghoda' },
    { name: 'Kognara', gpName: 'Charbhantha', block: 'Gharghoda' },
  ],
  'PATRATU': [
    { name: 'Deawariya', gpName: 'Dewariya', block: 'Patratu' },
    { name: 'Matkama', gpName: 'Dewariya', block: 'Patratu' },
    { name: 'Hurumgarha', gpName: 'Jawaharnagar', block: 'Patratu' },
    { name: 'Kurse', gpName: 'Kurse', block: 'Patratu' },
    { name: 'Bhandra', gpName: 'Kurse', block: 'Patratu' },
    { name: 'Kushiyara', gpName: 'Kurse', block: 'Patratu' },
    { name: 'Ghagra', gpName: 'Kurse', block: 'Patratu' },
    { name: 'Balkudra', gpName: 'Balkudra', block: 'Patratu' },
    { name: 'Labga', gpName: 'Labga', block: 'Patratu' },
    { name: 'Rasda', gpName: 'Labga', block: 'Patratu' },
    { name: 'Gegda', gpName: 'Labga', block: 'Patratu' },
    { name: 'Kinni', gpName: 'Labga', block: 'Patratu' },
    { name: 'Jainagar', gpName: 'Jainagar', block: 'Patratu' },
    { name: 'Uchringa', gpName: 'Talatand', block: 'Patratu' },
    { name: 'Soliya', gpName: 'Talatand', block: 'Patratu' },
    { name: 'Daridih (Birhor Colony)', gpName: 'Koto', block: 'Patratu' },
  ],
  'SIMHAPURI (NELLORE)': [
    { name: 'Thamminapatnam', gpName: 'Thamminapatnam', block: 'Nellore' },
    { name: 'Thamminapatnam - Harijanwada', gpName: 'Thamminapatnam', block: 'Nellore' },
    { name: 'Gummaladibba - Kothuru', gpName: 'Thamminapatnam', block: 'Nellore' },
    { name: 'Gummaladibba - Pathuru', gpName: 'Thamminapatnam', block: 'Nellore' },
    { name: 'Lingavaram', gpName: 'Lingavaram', block: 'Nellore' },
    { name: 'Pallevanidibba', gpName: 'Lingavaram', block: 'Nellore' },
    { name: 'Teegepalam', gpName: 'Lingavaram', block: 'Nellore' },
    { name: 'Talabaita', gpName: 'Lingavaram', block: 'Nellore' },
    { name: 'Gonugunta', gpName: 'Lingavaram', block: 'Nellore' },
    { name: 'Varagali - Pattapupalem', gpName: 'Varagali', block: 'Nellore' },
    { name: 'Varagali - Harijanwada', gpName: 'Varagali', block: 'Nellore' },
    { name: 'Varagali - ST Colony', gpName: 'Varagali', block: 'Nellore' },
    { name: 'Momidi - Pattapupalem', gpName: 'Momidi', block: 'Nellore' },
    { name: 'Momidi - ST Colony', gpName: 'Momidi', block: 'Nellore' },
    { name: 'Puniguntapalem', gpName: 'Momidi', block: 'Nellore' },
    { name: 'Mannegunta Main', gpName: 'Mannegunta', block: 'Nellore' },
    { name: 'Cherukuvaripalem', gpName: 'Mannegunta', block: 'Nellore' },
  ],
  'SHIRPUR': [
    { name: 'Waghode', gpName: 'Waghode', block: 'Nardana' },
    { name: 'Malich', gpName: 'Malich', block: 'Nardana' },
    { name: 'Melane', gpName: 'Melane', block: 'Nardana' },
    { name: 'Jatoda', gpName: 'Jatoda', block: 'Nardana' },
    { name: 'Gorane', gpName: 'Gorane', block: 'Nardana' },
    { name: 'Nardana', gpName: 'Nardana', block: 'Nardana' },
    { name: 'Vittai', gpName: 'Vittai', block: 'Nardana' },
    { name: 'Dhandharne', gpName: 'Dhandharne', block: 'Nardana' },
    { name: 'Varud', gpName: 'Varud', block: 'Nardana' },
    { name: 'Wargaon', gpName: 'Wargaon', block: 'Nardana' },
    { name: 'Ajande', gpName: 'Ajande', block: 'Nardana' },
    { name: 'Walkheda', gpName: 'Walkheda', block: 'Nardana' },
    { name: 'Kanchanpur', gpName: 'Kanchanpur', block: 'Nardana' },
    { name: 'Kalambu', gpName: 'Kalambu', block: 'Nardana' },
  ],
};

// Custom Previous Arrow Component
const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      type="button"
      data-role="none"
      className={`${className} slick-arrow slick-prev`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Previous
    </button>
  );
};

// Custom Next Arrow Component
const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      type="button"
      data-role="none"
      className={`${className} slick-arrow slick-next`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Next
    </button>
  );
};

/**
 * Singular for exactly one, plural otherwise: 1 -> "Gram Panchyat", 2+ -> "Gram Panchyats".
 * Always pass the real total rather than the counter's animating value, or the label
 * would flip between forms while the number counts up.
 */
const plural = (count: number, word: string) => (count === 1 ? word : `${word}s`);

// Animated Number Counter Component
const AnimatedCounter = ({ target, isActive }: { target: number; isActive: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCount(0);
      return;
    }

    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isActive]);

  return <span className="regionOps-stat-number mb-0">{count}</span>;
};

// Village List Component (outside slider) — UNCHANGED, still uses village-* classes
const VillageListSection = ({
  stateName,
  locations,
  isActive
}: {
  stateName: string;
  locations: LocationStat[];
  isActive: boolean;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset to first tab when slide changes
  useEffect(() => {
    if (isActive) {
      setActiveTab(0);
    }
  }, [isActive, stateName]);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  if (!isActive) return null;

  const currentLocation = locations[activeTab];
  const villages = villageData[currentLocation?.location] || [];

  return (
    <div className="village-section">
      <div className="village-section-header">
        { }      <h2 className="village-section-title">List of Villages in {stateName}</h2>
      </div>

      {/* Location Tabs */}
      <div className="village-tabs">
        {locations.map((loc, idx) => (
          <button
            key={idx}
            className={`village-tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}
          >
            {loc.location} ({loc.village})
          </button>
        ))}
      </div>

      {/* Village Table with smooth transition */}
      <div className="village-table-wrapper">
        <div className={`village-table-content ${isTransitioning ? 'transitioning' : ''}`}>
          {/*        <h4 className="village-location-title">
            Villages in {currentLocation?.location}
          </h4> */}
          {villages.length > 0 ? (
            <div className="village-table-scroll">
              <table className="village-table">
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Name of the Village</th>
                    <th>Gram Panchayat Name</th>
                    <th>Block</th>
                  </tr>
                </thead>
                <tbody>
                  {villages.map((village, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{village.name}</td>
                      <td>{village.gpName || '-'}</td>
                      <td>{village.block}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-villages">No village data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RegionOperationsSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    beforeChange: (_current: number, next: number) => setActiveSlide(next),
  };

  const currentStateData = operationsData[activeSlide];

  return (
    <>
      {/* Slider Section with Grey Background */}
      <section className="regionOps-slider-section pb-5">
        <div className="container custom_container">
          <Slider {...sliderSettings}>
            {operationsData.map((stateItem, slideIndex) => {
              const isSlideActive = activeSlide === slideIndex;

              return (
                <div key={stateItem.id}>
                  <div className="regionOps-card">
                    <div className="regionOps-grid">
                      {/* Left: Map Image Column */}
                      <div className="regionOps-map-col">
                        <Image
                          src={stateItem.mapImage}
                          alt={`${stateItem.stateName} Map`}
                          width={1200}
                          height={1200}
                          unoptimized
                          priority
                          className="regionOps-map-img"
                        />
                      </div>

                      {/* Right: Stats Column */}
                      <div className="regionOps-stats-col">
                        {stateItem.locations.map((loc, idx) => (
                          <div key={idx} className="regionOps-location-block">
                            <div className="regionOps-location-title">{loc.location}</div>
                            <div className="regionOps-stats-row">
                              <div className="regionOps-stat-item">
                                <AnimatedCounter target={loc.gramPanchayat} isActive={isSlideActive} />
                                <span className="regionOps-stat-label">{plural(loc.gramPanchayat, 'Gram Panchyat')}</span>
                              </div>
                              <div className="regionOps-stat-item">
                                <AnimatedCounter target={loc.village} isActive={isSlideActive} />
                                <span className="regionOps-stat-label">{plural(loc.village, 'Village')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

      {/* Village List Section - Outside Slider with White Background — UNCHANGED */}
      {currentStateData && (
        <section className="village-section-wrapper">
          <div className="container custom_container">
            <VillageListSection
              stateName={currentStateData.stateName}
              locations={currentStateData.locations}
              isActive={true}
            />
          </div>
        </section>
      )}
    </>
  );
}
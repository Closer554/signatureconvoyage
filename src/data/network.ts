export type NetworkPoint = { name: string; x: number; y: number; zone: string };
export const networkPoints: NetworkPoint[] = [
  {name:"Lille",x:50.5,y:7.9,zone:"Hauts-de-France"},{name:"Paris",x:45.3,y:22.2,zone:"Île-de-France"},{name:"Rouen",x:39.2,y:18.6,zone:"Normandie"},{name:"Rennes",x:21.1,y:26,zone:"Bretagne"},{name:"Nantes",x:20.9,y:40,zone:"Pays de la Loire"},{name:"Strasbourg",x:76.4,y:21,zone:"Grand Est"},{name:"Dijon",x:61.3,y:37.3,zone:"Bourgogne-Franche-Comté"},{name:"Lyon",x:61.8,y:49.6,zone:"Auvergne-Rhône-Alpes"},{name:"Clermont-Ferrand",x:50.2,y:54.6,zone:"Auvergne"},{name:"Bordeaux",x:27.1,y:69,zone:"Nouvelle-Aquitaine"},{name:"Toulouse",x:39.8,y:74.5,zone:"Occitanie"},{name:"Montpellier",x:54.5,y:76.3,zone:"Occitanie"},{name:"Marseille",x:63.6,y:78.2,zone:"Provence-Alpes-Côte d’Azur"},{name:"Nice",x:74.5,y:75,zone:"Côte d’Azur"},{name:"Ajaccio",x:82.2,y:90.3,zone:"Corse"}
];
export const networkZones = [...new Set(networkPoints.map((point) => point.zone))];

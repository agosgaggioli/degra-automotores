import React from 'react';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileage: number;
  price?: number;
  currency: string;
  transmission: string;
  fuel: string;
  image: string;
  slug: string;
}

interface Props {
  vehicle: Vehicle;
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(price);
}

const VehicleCard = ({ vehicle }: Props) => {
  return (
    <div className="bg-white bg-opacity-5 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition relative cursor-pointer">
      <a href={`/vehiculos/${vehicle.slug}`}>
        <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-48 object-cover" loading="lazy" />
        <div className="p-4 text-white">
          <h3 className="text-xl font-semibold">{vehicle.brand} {vehicle.model}</h3>
          <p>{vehicle.version} • {vehicle.year}</p>
          <p>{vehicle.mileage.toLocaleString()} km</p>
          {vehicle.price && <p className="font-bold mt-2">{formatPrice(vehicle.price, vehicle.currency)}</p>}
          <p>{vehicle.transmission} • {vehicle.fuel}</p>
          <button className="mt-4 bg-bluePrimary hover:bg-blueSecondary py-2 px-4 rounded w-full font-semibold transition">Ver vehículo</button>
        </div>
      </a>
    </div>
  );
};

export default VehicleCard;

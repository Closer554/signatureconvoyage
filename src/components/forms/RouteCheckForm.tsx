"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressAutocomplete } from "./AddressAutocomplete";

export function RouteCheckForm() {
  const router = useRouter();
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [selected, setSelected] = useState({ departure: false, arrival: false });
  const [errors, setErrors] = useState({ departure: "", arrival: "" });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      departure: selected.departure ? "" : "Sélectionnez une adresse dans la liste",
      arrival: selected.arrival ? "" : "Sélectionnez une adresse dans la liste",
    };
    setErrors(nextErrors);
    if (nextErrors.departure || nextErrors.arrival) return;

    const query = new URLSearchParams({ depart: departure, arrivee: arrival });
    router.push(`/devis?${query.toString()}#adresses`);
  };

  return (
    <form onSubmit={submit}>
      <AddressAutocomplete
        label="D’où part le véhicule ?"
        name="departure"
        value={departure}
        error={errors.departure}
        onChange={setDeparture}
        onSelectionChange={(value) => {
          setSelected((current) => ({ ...current, departure: value }));
          if (value) setErrors((current) => ({ ...current, departure: "" }));
        }}
      />
      <AddressAutocomplete
        label="Où doit-il arriver ?"
        name="arrival"
        value={arrival}
        error={errors.arrival}
        onChange={setArrival}
        onSelectionChange={(value) => {
          setSelected((current) => ({ ...current, arrival: value }));
          if (value) setErrors((current) => ({ ...current, arrival: "" }));
        }}
      />
      <button className="btn primary">Continuer ma demande de devis</button>
    </form>
  );
}

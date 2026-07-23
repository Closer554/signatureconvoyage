"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, MapPin } from "lucide-react";

type Suggestion = {
  label: string;
  city: string;
  postcode: string;
};

type Props = {
  label: string;
  name: string;
  value?: string;
  error?: string;
  onChange: (value: string) => void;
  onSelectionChange: (selected: boolean) => void;
};

export function AddressAutocomplete({
  label,
  name,
  value = "",
  error,
  onChange,
  onSelectionChange,
}: Props) {
  const listId = useId();
  const requestId = useRef(0);
  const skipNextSearch = useRef(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const query = value.trim();
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (query.length < 3) return;

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setServiceError(false);
      try {
        const response = await fetch(`/api/addresses?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { suggestions?: Suggestion[] };
        if (currentRequest !== requestId.current) return;
        setSuggestions(data.suggestions ?? []);
        setServiceError(!response.ok);
        setOpen(true);
        setActiveIndex(-1);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setServiceError(true);
        setSuggestions([]);
        setOpen(true);
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const select = (suggestion: Suggestion) => {
    requestId.current += 1;
    skipNextSearch.current = true;
    onChange(suggestion.label);
    onSelectionChange(true);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const message = serviceError
    ? "Recherche indisponible. Réessayez dans un instant."
    : !loading && suggestions.length === 0
      ? "Aucune adresse trouvée"
      : null;

  return (
    <label className="field address-field">
      {label}
      <span className="address-input-wrap">
        <MapPin aria-hidden="true" />
        <input
          type="search"
          name={name}
          value={value}
          autoComplete="off"
          spellCheck={false}
          placeholder="N° et nom de voie, ville ou code postal"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          aria-invalid={!!error}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue);
            onSelectionChange(false);
            if (nextValue.trim().length < 3) {
              requestId.current += 1;
              setSuggestions([]);
              setOpen(false);
              setLoading(false);
            }
          }}
          onFocus={() => value.trim().length >= 3 && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
        />
        {loading && <LoaderCircle className="address-loader" aria-label="Recherche en cours" />}
      </span>
      {open && (
        <span className="address-dropdown">
          <span id={listId} role="listbox" aria-label={`Suggestions pour ${label}`}>
            {suggestions.map((suggestion, index) => (
              <button
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                key={`${suggestion.label}-${index}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(suggestion)}
              >
                <MapPin aria-hidden="true" />
                <span>
                  <strong>{suggestion.label}</strong>
                  <small>{suggestion.postcode} {suggestion.city}</small>
                </span>
              </button>
            ))}
            {message && <span className="address-message">{message}</span>}
          </span>
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

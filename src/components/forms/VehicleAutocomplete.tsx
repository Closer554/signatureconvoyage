"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CarFront, LoaderCircle } from "lucide-react";

type Suggestion = { id: string; label: string };

type Props = {
  label: string;
  name: string;
  value?: string;
  resource: "makes" | "models";
  category?: string;
  make?: string;
  disabled?: boolean;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSelectionChange: (selected: boolean) => void;
};

export function VehicleAutocomplete({
  label,
  name,
  value = "",
  resource,
  category,
  make,
  disabled = false,
  error,
  placeholder,
  onChange,
  onSelectionChange,
}: Props) {
  const listId = useId();
  const requestId = useRef(0);
  const skipNextSearch = useRef(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const query = value.trim();
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (disabled || query.length < 1 || (resource === "models" && !make)) return;

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      const params = new URLSearchParams({ resource, q: query });
      if (category) params.set("category", category);
      if (make) params.set("make", make);

      try {
        const response = await fetch(`/api/vehicles?${params}`, { signal: controller.signal });
        const data = (await response.json()) as { suggestions?: Suggestion[] };
        if (currentRequest !== requestId.current) return;
        setSuggestions(data.suggestions ?? []);
        setFailed(!response.ok);
        setOpen(true);
        setActiveIndex(-1);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setSuggestions([]);
        setFailed(true);
        setOpen(true);
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [category, disabled, make, resource, value]);

  const select = (suggestion: Suggestion) => {
    requestId.current += 1;
    skipNextSearch.current = true;
    onChange(suggestion.label);
    onSelectionChange(true);
    setSuggestions([]);
    setOpen(false);
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

  return (
    <label className="field address-field">
      {label}
      <span className="address-input-wrap">
        <CarFront aria-hidden="true" />
        <input
          type="search"
          name={name}
          value={value}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
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
            if (!nextValue.trim()) {
              requestId.current += 1;
              setSuggestions([]);
              setOpen(false);
              setLoading(false);
            }
          }}
          onFocus={() => value.trim() && setOpen(true)}
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
                key={suggestion.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(suggestion)}
              >
                <CarFront aria-hidden="true" />
                <span><strong>{suggestion.label}</strong></span>
              </button>
            ))}
            {!loading && suggestions.length === 0 && (
              <span className="address-message">
                {failed ? "Catalogue indisponible. Réessayez dans un instant." : "Aucun résultat"}
              </span>
            )}
          </span>
        </span>
      )}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

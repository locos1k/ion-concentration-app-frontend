import type { FC, FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FILTER_RANGE } from '../modules/solutions.filter.ts';

interface Props {
  min: number;
  max: number;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  onSubmit: () => void;
}

export const SolutionsFilter: FC<Props> = ({
  min,
  max,
  setMin,
  setMax,
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Form className="filter-form" onSubmit={handleSubmit}>
      <label className="field-label">
        Молярная концентрация, моль/л: от {min} до {max}
      </label>
      <div className="range-slider">
        <div className="range-slider__track"></div>
        <input
          type="range"
          name="min"
          aria-label="Минимальная молярная концентрация"
          min={FILTER_RANGE.min}
          max={FILTER_RANGE.max}
          step={FILTER_RANGE.step}
          value={min}
          onChange={(event) => setMin(Number(event.target.value))}
        />
        <input
          type="range"
          name="max"
          aria-label="Максимальная молярная концентрация"
          min={FILTER_RANGE.min}
          max={FILTER_RANGE.max}
          step={FILTER_RANGE.step}
          value={max}
          onChange={(event) => setMax(Number(event.target.value))}
        />
      </div>
      <Button type="submit" className="filter-btn">
        Найти
      </Button>
    </Form>
  );
};

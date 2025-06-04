import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterSliders from './FilterSliders';

describe('FilterSliders Component', () => {
  const mockDistanceChange = vi.fn();
  const mockBudgetChange = vi.fn();
  const mockFoodSelect = vi.fn();
  const mockHousingSelect = vi.fn();
  const mockActivitySelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders distance and budget sliders and calls callbacks on change', () => {
    render(
      <FilterSliders
        distance={5}
        budget={50}
        onDistanceChange={mockDistanceChange}
        onBudgetChange={mockBudgetChange}
        selectedCategory=""
        onFoodTypeSelect={mockFoodSelect}
        selectedFoodType=""
        onHousingTypeSelect={mockHousingSelect}
        selectedHousingType=""
        onActivityTypeSelect={mockActivitySelect}
        selectedActivityType=""
      />
    );

    expect(screen.getByText(/Distance: 5 miles/)).toBeInTheDocument();
    expect(screen.getByText(/Budget: \$50/)).toBeInTheDocument();
  });

  it('shows food subcategory buttons and triggers selection', () => {
    render(
      <FilterSliders
        distance={5}
        budget={50}
        onDistanceChange={mockDistanceChange}
        onBudgetChange={mockBudgetChange}
        selectedCategory="food"
        onFoodTypeSelect={mockFoodSelect}
        selectedFoodType="restaurants"
        onHousingTypeSelect={mockHousingSelect}
        selectedHousingType=""
        onActivityTypeSelect={mockActivitySelect}
        selectedActivityType=""
      />
    );

    fireEvent.click(screen.getByText('Fast Food'));
    expect(mockFoodSelect).toHaveBeenCalledWith('fastfood');
  });

  it('shows housing subcategory buttons and triggers selection', () => {
    render(
      <FilterSliders
        distance={5}
        budget={50}
        onDistanceChange={mockDistanceChange}
        onBudgetChange={mockBudgetChange}
        selectedCategory="housing"
        onFoodTypeSelect={mockFoodSelect}
        selectedFoodType=""
        onHousingTypeSelect={mockHousingSelect}
        selectedHousingType="apartments"
        onActivityTypeSelect={mockActivitySelect}
        selectedActivityType=""
      />
    );

    fireEvent.click(screen.getByText('On-Campus Housings'));
    expect(mockHousingSelect).toHaveBeenCalledWith('dorms');
  });

  it('shows activity subcategory buttons and triggers selection', () => {
    render(
      <FilterSliders
        distance={5}
        budget={50}
        onDistanceChange={mockDistanceChange}
        onBudgetChange={mockBudgetChange}
        selectedCategory="activity"
        onFoodTypeSelect={mockFoodSelect}
        selectedFoodType=""
        onHousingTypeSelect={mockHousingSelect}
        selectedHousingType=""
        onActivityTypeSelect={mockActivitySelect}
        selectedActivityType="hiking"
      />
    );

    fireEvent.click(screen.getByText('Parks'));
    expect(mockActivitySelect).toHaveBeenCalledWith('parks');
  });
});

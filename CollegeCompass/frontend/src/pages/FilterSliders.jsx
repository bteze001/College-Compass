import { Slider } from '@mui/material';

export default function FilterSliders({ distance, budget, onDistanceChange, onBudgetChange,
    selectedCategory, onFoodTypeSelect, selectedFoodType,
    onHousingTypeSelect, selectedHousingType,
    onActivityTypeSelect, selectedActivityType }) {

    return (

        <div className='sliders-container'>
            <div className='distance-slider-container'>
                <label>Distance: {distance} miles </label>
                <Slider
                    value={distance}
                    onChange={onDistanceChange}
                    min={1}
                    max={10}
                    step={1}
                    valueLabelDisplay="auto"
                    className="slider"
                ></Slider>

                <div className="slider-range-labels">
                    <span>1 mi</span>
                    <span>10 mi</span>
                </div>
            </div>

            <div className='distance-slider-container'>
                <label>Budget: ${budget}</label>
                <Slider
                    value={budget}
                    onChange={onBudgetChange}
                    min={1}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    className="slider"
                ></Slider>

                <div className="slider-range-labels">
                    <span>$1</span>
                    <span>$100+</span>
                </div>
            </div>

            {selectedCategory === 'food' && (

                <div className='food-type-buttons'>
                    <button className={`subcategory-button ${selectedFoodType === 'restaurants' ? 'active' : ''}`}
                        onClick={() => onFoodTypeSelect('restaurants')}>
                        Restaurants
                    </button>
                    <button className={`subcategory-button ${selectedFoodType === 'fastfood' ? 'active' : ''}`}
                        onClick={() => onFoodTypeSelect('fastfood')}>
                        Fast Food
                    </button>
                    <button className={`subcategory-button ${selectedFoodType === 'coffee' ? 'active' : ''}`}
                        onClick={() => onFoodTypeSelect('coffee')}>
                        Coffee Shops
                    </button>
                    <button className={`subcategory-button ${selectedFoodType === 'all' ? 'active' : ''}`}
                        onClick={() => onFoodTypeSelect('all')}>
                        Clear
                    </button>
                </div>
            )}

            {selectedCategory === 'housing' && (

                <div className='hosuing-type-buttons'>
                    <button className={`subcategory-button ${selectedHousingType === 'dorms' ? 'active' : ''}`}
                        onClick={() => onHousingTypeSelect('dorms')}>
                        On-Campus Housings
                    </button>

                    <button className={`subcategory-button ${selectedHousingType === 'apartments' ? 'active' : ''}`}
                        onClick={() => onHousingTypeSelect('apartments')}>
                        Off-Campus Housings
                    </button>
                    <button className={`subcategory-button ${selectedHousingType === 'all' ? 'active' : ''}`}
                        onClick={() => onHousingTypeSelect('all')}>
                        Clear
                    </button>
                </div>
            )}

            {selectedCategory === 'activity' && (

                <div className='activity-type-buttons'>
                    <button className={`subcategory-button ${selectedActivityType === 'parks' ? 'active' : ''}`}
                        onClick={() => onActivityTypeSelect('parks')}>
                        Parks 
                    </button>

                    <button className={`subcategory-button ${selectedActivityType === 'theater' ? 'active' : ''}`}
                        onClick={() => onActivityTypeSelect('theater')}>
                        Movie Theaters 
                    </button>

                    <button className={`subcategory-button ${selectedActivityType === 'hiking' ? 'active' : ''}`}
                        onClick={() => onActivityTypeSelect('hiking')}>
                        Hiking 
                    </button>
                    <button className={`subcategory-button ${selectedFoodType === 'all' ? 'active' : ''}`}
                        onClick={() => onActivityTypeSelect('all')}>
                        Clear
                    </button>
                </div>

            )}
        </div>
    );
}
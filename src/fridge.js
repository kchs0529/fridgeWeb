import React from 'react';

function Fridge() {
  return (
    <div className="fridge-container">
      <div className="row">
        <div className="col-md-4 item1">Grains</div>
        <div className="col-md-4 item2">Vegetables</div>
        <div className="col-md-4 item3">Fruits</div>
      </div>
      <div className="row">
        <div className="col-md-4 item4">Dairy_and_Eggs</div>
        <div className="col-md-4 item5">Proteins</div>
        <div className="col-md-4 item6">Fats_and_Oils</div>
      </div>
      <div className="row">
        <div className="col-md-4 item7">Sweets</div>
        <div className="col-md-4 item8">Beverages</div>
        <div className="col-md-4 item9">Processed_Foods</div>
      </div>
    </div>
  );
}

export default Fridge;

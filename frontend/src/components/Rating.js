import React from 'react'

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <span>
        <i
          style={{ color }}
          className={
            value >= 1
              ? 'las la-star'
              : value >= 0.5
              ? 'las la-star-half'
              : 'lar la-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 2
              ? 'las la-star'
              : value >= 1.5
              ? 'las la-star-half'
              : 'lar la-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 3
              ? 'las la-star'
              : value >= 2.5
              ? 'las la-star-half'
              : 'lar la-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 4
              ? 'las la-star'
              : value >= 3.5
              ? 'las la-star-half'
              : 'lar la-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 5
              ? 'las la-star'
              : value >= 4.5
              ? 'las la-star-half'
              : 'lar la-star'
          }
        ></i>
      </span>
      <span className="text">{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#2aa8f2',
}

export default Rating

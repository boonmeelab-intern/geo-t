import React from 'react'

/**
 * @function SquareBullet
 * @description Render a square bullet mainly used to indicated each mapview information
 * @param {String} color Bullet color
 * @param {Number} size Bullet size
 * @param {Number} margin Bullet margin
 * @return {React.Component}
 */
export default function SquareBullet({ color, size = 7, margin }) {
  const bulletStyle = {
    backgroundColor: color,
    width: size,
    height: size,
    margin
  }
  return (
    <div style={bulletStyle}/>
  )
} 

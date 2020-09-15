export function rotateImage(deg) {
  let rTop, rRight, rBottom, rLeft
  let fTop, fRight, fBottom, fLeft

  switch (deg) {
    case 0:
      rTop = 0
      rRight = 0
      rBottom = null
      rLeft = null

      fTop = null
      fRight = 0
      fBottom = 0
      fLeft = null
      break
    case 90:
      rTop = 0
      rLeft = 0
      rBottom = null
      rRight = null

      fTop = 0
      fRight = 0
      fBottom = null
      fLeft = null
      break
    case 180:
      rBottom = 0
      rLeft = 0
      rTop = null
      rRight = null

      fTop = 0
      fRight = null
      fBottom = null
      fLeft = 0
      break
    case 270:
      rBottom = 0
      rRight = 0
      rTop = null
      rLeft = null

      fTop = null
      fRight = null
      fBottom = 0
      fLeft = 0
      break
  }

  return { rTop, rRight, rBottom, rLeft, fTop, fRight, fBottom, fLeft }
}

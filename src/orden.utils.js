const getNumeroVisual = (numorden, tipo_orden) => {
  if (!tipo_orden || tipo_orden === "reparacion") {
    return `REP-${numorden}`;
  }

  if (tipo_orden === "service") {
    return `SRV-${numorden}`;
  }

  return numorden;
};

module.exports = { getNumeroVisual };
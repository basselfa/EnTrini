export default {
  "name": "Gym",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nombre del gimnasio"
    },
    "owner_email": {
      "type": "string",
      "format": "email",
      "description": "Email del propietario"
    },
    "description": {
      "type": "string",
      "description": "Descripción del gimnasio"
    },
    "address": {
      "type": "string",
      "description": "Dirección completa"
    },
    "city": {
      "type": "string",
      "description": "Ciudad"
    },
    "area": {
      "type": "string",
      "description": "Zona/Área/Wilaya"
    },
    "phone": {
      "type": "string",
      "description": "Teléfono"
    },
    "amenities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Servicios disponibles"
    },
    "hours": {
      "type": "string",
      "description": "Horario"
    },
    "image_url": {
      "type": "string",
      "description": "URL imagen"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "active",
        "suspended"
      ],
      "default": "pending",
      "description": "Estado"
    },
    "capacity": {
      "type": "number",
      "description": "Capacidad máxima"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "description": "Si el gimnasio es destacado"
    }
  },
  "required": [
    "name",
    "owner_email",
    "address",
    "city"
  ]
}
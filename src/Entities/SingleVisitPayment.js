{
  "name": "SingleVisitPayment",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email del usuario"
    },
    "gym_id": {
      "type": "string",
      "description": "ID del gimnasio"
    },
    "gym_name": {
      "type": "string",
      "description": "Nombre del gimnasio"
    },
    "check_in_id": {
      "type": "string",
      "description": "ID del check-in asociado"
    },
    "amount_paid": {
      "type": "number",
      "default": 300,
      "description": "Monto pagado por el cliente (300 DZD)"
    },
    "gym_amount": {
      "type": "number",
      "default": 200,
      "description": "Monto para el socio gimnasio (200 DZD)"
    },
    "commission": {
      "type": "number",
      "default": 100,
      "description": "Comisión TRini213 (100 DZD)"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "completed",
        "failed"
      ],
      "default": "completed",
      "description": "Estado del pago"
    },
    "payment_date": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha del pago"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "cash",
        "baridimob",
        "ccp",
        "dahabia",
        "credit_card"
      ],
      "default": "cash",
      "description": "Método de pago"
    }
  },
  "required": [
    "user_email",
    "gym_id",
    "amount_paid",
    "gym_amount",
    "commission",
    "payment_date"
  ]
}
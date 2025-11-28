export default {
  "name": "Payment",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email del usuario"
    },
    "membership_id": {
      "type": "string",
      "description": "ID de la membres\u00eda"
    },
    "amount": {
      "type": "number",
      "description": "Monto pagado"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "credit_card",
        "debit_card",
        "bank_transfer",
        "paypal"
      ],
      "description": "M\u00e9todo de pago"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "completed",
        "failed",
        "refunded"
      ],
      "default": "pending",
      "description": "Estado del pago"
    },
    "transaction_id": {
      "type": "string",
      "description": "ID de transacci\u00f3n"
    },
    "payment_date": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha del pago"
    }
  },
  "required": [
    "user_email",
    "amount",
    "payment_method"
  ]
}
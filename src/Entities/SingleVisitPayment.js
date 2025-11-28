{
  "name": "SingleVisitPayment",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email de l'utilisateur"
    },
    "gym_id": {
      "type": "string",
      "description": "ID de la salle"
    },
    "gym_name": {
      "type": "string",
      "description": "Nom de la salle"
    },
    "check_in_id": {
      "type": "string",
      "description": "ID du check-in associé"
    },
    "amount_paid": {
      "type": "number",
      "default": 300,
      "description": "Montant payé par le client (300 DZD)"
    },
    "gym_amount": {
      "type": "number",
      "default": 200,
      "description": "Montant pour le partenaire gym (200 DZD)"
    },
    "commission": {
      "type": "number",
      "default": 100,
      "description": "Commission TRini213 (100 DZD)"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "completed",
        "failed"
      ],
      "default": "completed",
      "description": "Statut du paiement"
    },
    "payment_date": {
      "type": "string",
      "format": "date-time",
      "description": "Date du paiement"
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
      "description": "Méthode de paiement"
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
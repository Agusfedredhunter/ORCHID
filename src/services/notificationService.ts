import { Note } from '../models/Note';

// Lo de acá abajo (sent, _getSentNotifications, _clearSentNotifications) NO
// es parte del ejercicio: es plomería para que la cátedra pueda verificar
// desde afuera (por HTTP, sin leer el código de cada grupo) que notify()
// se llamó. No hace falta que lo usen ni lo entiendan para resolver el
// Ejercicio 6.
const sent: Note[] = [];

// "Servicio externo" simulado: en una app real acá iría un email, un SMS,
// un push notification, etc. Para este práctico alcanza con loguear.
//
// La función se exporta a nivel de módulo (no es una clase) a propósito:
// así en el Ejercicio 6 la van a poder simular por completo con
// vi.mock('../../src/services/notificationService', ...), tal como se
// vio en la Parte 1 de la guía de Vitest del aula virtual.
export function notify(note: Note): void {
  sent.push(note);
  console.log(`Nota fijada: "${note.title}" (id ${note.id})`);
}

export function _getSentNotifications(): Note[] {
  return sent;
}

export function _clearSentNotifications(): void {
  sent.length = 0;
}

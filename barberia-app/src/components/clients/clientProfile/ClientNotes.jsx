import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de notas del cliente
 */
const ClientNotes = ({ client }) => {
  if (!client.notes) {
    return null;
  }

  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.notesTitle}
      </h4>
      <p className="text-gray-600 dark:text-gray-400">{client.notes}</p>
    </div>
  );
};

export default ClientNotes;

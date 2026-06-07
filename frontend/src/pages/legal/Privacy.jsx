import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const LAST_UPDATED = "juin 2026";
const CONTACT_EMAIL = "wcalexrubiks@gmail.com";

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      <div className="text-sm text-text-muted leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center hover:bg-bg-raised transition"
        >
          <ChevronLeft size={18} className="text-text-muted" />
        </button>
        <h1 className="text-lg font-medium text-text-primary">Politique de confidentialité</h1>
      </div>

      <div className="px-4 pb-12 space-y-6">

        <p className="text-xs text-text-disabled">Dernière mise à jour : {LAST_UPDATED}</p>

        <Section title="1. Responsable du traitement">
          <p>
            CubVoit est un projet personnel à but non lucratif, sans structure juridique
            formelle, exploité à titre individuel. Pour toute question relative aux données
            personnelles, il est possible de contacter l'équipe à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p>Les données suivantes sont collectées lors de l'utilisation de CubVoit :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><span className="text-text-secondary font-medium">Identifiant et mot de passe</span> — nécessaires à la création et à l'accès au compte</li>
            <li><span className="text-text-secondary font-medium">Pseudo et email</span> — pour l'identification au sein de l'application</li>
            <li><span className="text-text-secondary font-medium">WCA ID</span> — optionnel, renseigné volontairement via l'authentification WCA</li>
            <li><span className="text-text-secondary font-medium">Localisation approximative</span> — ville ou commune de domicile, utilisée comme point de départ par défaut</li>
            <li><span className="text-text-secondary font-medium">Avatar</span> — photo de profil optionnelle</li>
            <li><span className="text-text-secondary font-medium">Données de trajets</span> — lieux de départ et d'arrivée, dates, véhicules, passagers associés</li>
          </ul>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Permettre la création et la gestion des comptes utilisateurs</li>
            <li>Afficher et organiser les trajets de covoiturage</li>
            <li>Faciliter la mise en relation entre conducteurs et passagers</li>
            <li>Assurer le fonctionnement du cercle privé</li>
          </ul>
          <p>
            Aucune donnée n'est utilisée à des fins publicitaires ou commerciales.
          </p>
        </Section>

        <Section title="4. Partage des données">
          <p>
            Les données personnelles ne sont ni vendues, ni louées, ni transmises à des
            tiers à des fins commerciales.
          </p>
          <p>
            Certaines informations de profil (pseudo, avatar, WCA ID) sont visibles par
            les autres utilisateurs de l'application dans le cadre normal de son
            fonctionnement — par exemple, en tant que conducteur ou passager d'un trajet.
          </p>
        </Section>

        <Section title="5. Durée de conservation">
          <p>
            Les données sont conservées aussi longtemps que le compte est actif. Lors de
            la suppression du compte, l'ensemble des données personnelles associées est
            supprimé dans un délai raisonnable.
          </p>
        </Section>

        <Section title="6. Sécurité">
          <p>
            Des mesures techniques raisonnables sont mises en œuvre pour protéger les
            données contre tout accès non autorisé, notamment le chiffrement des mots de
            passe et l'utilisation de tokens d'authentification sécurisés (JWT).
          </p>
        </Section>

        <Section title="7. Droits des utilisateurs">
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD),
            tout utilisateur dispose des droits suivants :
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><span className="text-text-secondary font-medium">Droit d'accès</span> — obtenir une copie des données détenues</li>
            <li><span className="text-text-secondary font-medium">Droit de rectification</span> — corriger des données inexactes</li>
            <li><span className="text-text-secondary font-medium">Droit à l'effacement</span> — demander la suppression des données</li>
            <li><span className="text-text-secondary font-medium">Droit à la portabilité</span> — recevoir ses données dans un format structuré</li>
            <li><span className="text-text-secondary font-medium">Droit d'opposition</span> — s'opposer à certains traitements</li>
          </ul>
          <p>
            Pour exercer ces droits, il convient d'envoyer une demande à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">{CONTACT_EMAIL}</a>.
            Une réponse sera apportée dans un délai maximum de 30 jours.
          </p>
        </Section>

        <Section title="8. Cookies et traceurs">
          <p>
            CubVoit n'utilise pas de cookies de traçage ou publicitaires. Les seules
            données stockées localement sur l'appareil sont les tokens d'authentification,
            nécessaires au maintien de la session.
          </p>
        </Section>

        <Section title="9. Modifications">
          <p>
            La présente politique peut être mise à jour à tout moment. Les utilisateurs
            seront informés de toute modification significative. La date de dernière mise
            à jour est indiquée en haut de ce document.
          </p>
        </Section>

        <Section title="10. Contact et réclamations">
          <p>
            Pour toute question ou réclamation relative à la protection des données, il
            est possible de contacter l'équipe à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">{CONTACT_EMAIL}</a>.
          </p>
          <p>
            En cas de réponse insatisfaisante, il est également possible de saisir la
            Commission Nationale de l'Informatique et des Libertés (CNIL) via{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-primary">
              www.cnil.fr
            </a>.
          </p>
        </Section>

      </div>
    </div>
  );
}
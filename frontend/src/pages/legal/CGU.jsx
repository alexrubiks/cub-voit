import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const LAST_UPDATED = "juin 2026";
const CONTACT_EMAIL = "contact@cubvoit.fr";

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

export default function CGU() {
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
        <h1 className="text-lg font-medium text-text-primary">Conditions générales d'utilisation</h1>
      </div>

      <div className="px-4 pb-12 space-y-6">

        <p className="text-xs text-text-disabled">Dernière mise à jour : {LAST_UPDATED}</p>

        <Section title="1. Présentation">
          <p>
            CubVoit est une application de covoiturage destinée à la communauté speedcubing,
            permettant aux utilisateurs de proposer et rejoindre des trajets pour se rendre
            aux compétitions de Rubik's Cube.
          </p>
          <p>
            CubVoit est un projet personnel à but non lucratif, sans structure juridique
            formelle. L'utilisation de l'application est gratuite.
          </p>
        </Section>

        <Section title="2. Acceptation des CGU">
          <p>
            L'utilisation de CubVoit implique l'acceptation pleine et entière des présentes
            conditions. Toute personne n'acceptant pas ces conditions est invitée à ne pas
            utiliser l'application.
          </p>
        </Section>

        <Section title="3. Inscription et compte">
          <p>
            L'accès à CubVoit nécessite la création d'un compte avec un identifiant et un
            mot de passe. L'utilisateur est responsable de la confidentialité de ses
            identifiants et de toute activité effectuée depuis son compte.
          </p>
          <p>
            Il est possible de renseigner un profil WCA afin de faciliter l'identification
            au sein de la communauté. Cette information est optionnelle.
          </p>
        </Section>

        <Section title="4. Utilisation de l'application">
          <p>L'utilisation de CubVoit implique le respect des règles suivantes. Il est notamment interdit de :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Publier des informations fausses ou trompeuses</li>
            <li>Usurper l'identité d'un autre utilisateur</li>
            <li>Utiliser l'application à des fins commerciales sans accord préalable</li>
            <li>Tenter de compromettre la sécurité ou le fonctionnement de l'application</li>
          </ul>
        </Section>

        <Section title="5. Responsabilité des trajets">
          <p>
            CubVoit est une plateforme de mise en relation. L'application ne garantit pas
            la réalisation des trajets proposés et n'est en aucun cas partie prenante du
            covoiturage entre utilisateurs.
          </p>
          <p>
            Chaque conducteur est responsable de son véhicule, de son assurance et du
            respect du code de la route. Il est recommandé de vérifier que l'assurance
            souscrite couvre le transport de passagers dans le cadre du covoiturage non
            rémunéré.
          </p>
          <p>
            CubVoit ne saurait être tenu responsable des incidents, accidents ou litiges
            survenant dans le cadre d'un trajet organisé via l'application.
          </p>
        </Section>

        <Section title="6. Données personnelles">
          <p>
            Les données collectées (pseudo, email, localisation approximative) sont utilisées
            uniquement pour le fonctionnement de l'application. Elles ne sont ni vendues ni
            transmises à des tiers.
          </p>
          <p>
            Conformément au RGPD, tout utilisateur dispose d'un droit d'accès, de
            rectification et de suppression de ses données. Pour exercer ces droits, il
            convient de contacter l'équipe à l'adresse{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="7. Modification des CGU">
          <p>
            Les présentes conditions peuvent être modifiées à tout moment. Les utilisateurs
            seront informés des changements significatifs. La poursuite de l'utilisation de
            l'application après modification vaut acceptation des nouvelles conditions.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Pour toute question relative aux présentes CGU, il est possible de contacter
            l'équipe à l'adresse{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

      </div>
    </div>
  );
}
import { useState } from 'react';
import clsx from 'clsx';
import { ticketCategories, priorityOptions } from '@data/supportData';

const SupportTicketForm = () => {
  const [form, setForm] = useState({
    subject: '',
    category: '',
    priority: '',
    bookingRef: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    const e = { ...errors };
    delete e[field];
    if (field === 'subject' && (!value || !value.trim())) e.subject = 'Le sujet est requis';
    if (field === 'category' && !value) e.category = 'La catégorie est requise';
    if (field === 'priority' && !value) e.priority = 'La priorité est requise';
    if (field === 'description' && (!value || !value.trim())) e.description = 'La description est requise';
    setErrors(e);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!form.category) newErrors.category = 'La catégorie est requise';
    if (!form.priority) newErrors.priority = 'La priorité est requise';
    if (!form.description.trim()) newErrors.description = 'La description est requise';
    setErrors(newErrors);
    setTouched({ subject: true, category: true, priority: true, description: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => {
        setForm({ subject: '', category: '', priority: '', bookingRef: '', description: '' });
        setErrors({});
        setTouched({});
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="sp-ticket-form" id="sp-ticket">
      <h3 className="sp-section-title">
        <i className="bi bi-pencil-square" />
        Créer une demande d'assistance
      </h3>

      <div className="sp-card">
        {submitted ? (
          <div className="sp-ticket-form__success">
            <div className="sp-ticket-form__success-icon">
              <i className="bi bi-check-circle-fill" />
            </div>
            <h4>Demande envoyée avec succès !</h4>
            <p>Nous traiterons votre demande dans les plus brefs délais. Vous recevrez une confirmation par email.</p>
            <span className="sp-ticket-form__success-id">Référence : ASS-2026-005</span>
          </div>
        ) : (
          <form className="sp-form" onSubmit={handleSubmit}>
            <div className="sp-form__row sp-form__row--2">
              <div className={clsx('sp-field', errors.subject && touched.subject && 'sp-field--error')}>
                <label className="sp-field__label" htmlFor="sp-subject">
                  Sujet <span className="sp-field__required">*</span>
                </label>
                <div className="sp-field__input-wrapper">
                  <i className="bi bi-card-text sp-field__icon" />
                  <input
                    id="sp-subject"
                    type="text"
                    className="sp-field__input"
                    placeholder="Décrivez brièvement votre problème"
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    onBlur={() => handleBlur('subject')}
                  />
                </div>
                {errors.subject && touched.subject && <span className="sp-field__error">{errors.subject}</span>}
              </div>

              <div className={clsx('sp-field', errors.category && touched.category && 'sp-field--error')}>
                <label className="sp-field__label" htmlFor="sp-category">
                  Catégorie <span className="sp-field__required">*</span>
                </label>
                <div className="sp-field__input-wrapper">
                  <i className="bi bi-tag sp-field__icon" />
                  <select
                    id="sp-category"
                    className="sp-field__select"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    onBlur={() => handleBlur('category')}
                  >
                    {ticketCategories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                {errors.category && touched.category && <span className="sp-field__error">{errors.category}</span>}
              </div>
            </div>

            <div className="sp-form__row sp-form__row--2">
              <div className={clsx('sp-field', errors.priority && touched.priority && 'sp-field--error')}>
                <label className="sp-field__label" htmlFor="sp-priority">
                  Priorité <span className="sp-field__required">*</span>
                </label>
                <div className="sp-field__input-wrapper">
                  <i className="bi bi-flag sp-field__icon" />
                  <select
                    id="sp-priority"
                    className="sp-field__select"
                    value={form.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    onBlur={() => handleBlur('priority')}
                  >
                    {priorityOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                {errors.priority && touched.priority && <span className="sp-field__error">{errors.priority}</span>}
              </div>

              <div className="sp-field">
                <label className="sp-field__label" htmlFor="sp-booking">
                  Numéro de réservation <span className="sp-field__optional">(facultatif)</span>
                </label>
                <div className="sp-field__input-wrapper">
                  <i className="bi bi-ticket-perforated sp-field__icon" />
                  <input
                    id="sp-booking"
                    type="text"
                    className="sp-field__input"
                    placeholder="BK-2026-XXXX"
                    value={form.bookingRef}
                    onChange={(e) => handleChange('bookingRef', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={clsx('sp-field', errors.description && touched.description && 'sp-field--error')}>
              <label className="sp-field__label" htmlFor="sp-desc">
                Description <span className="sp-field__required">*</span>
              </label>
              <div className="sp-field__input-wrapper sp-field__input-wrapper--textarea">
                <i className="bi bi-body-text sp-field__icon" />
                <textarea
                  id="sp-desc"
                  className="sp-field__textarea"
                  placeholder="Décrivez votre problème en détail..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                />
              </div>
              {errors.description && touched.description && <span className="sp-field__error">{errors.description}</span>}
            </div>

            <div className="sp-form__upload">
              <div className="sp-form__upload-box">
                <i className="bi bi-cloud-arrow-up" />
                <span>Joindre un fichier</span>
                <span className="sp-form__upload-note">Bientôt disponible</span>
              </div>
            </div>

            <div className="sp-form__actions">
              <button type="submit" className="sp-btn sp-btn--primary">
                <i className="bi bi-send" />
                Envoyer la demande
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportTicketForm;

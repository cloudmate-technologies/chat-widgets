import { createSignal, createEffect, Show, For } from 'solid-js';
import { z } from 'zod';

type LeadFormProps = {
  onSubmit: (data: LeadFormData) => void;
  onClose?: () => void;
};

export type LeadFormData = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  contactDate?: string;
  companySize?: string;
};

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const LeadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').nonempty('Name is required'),
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional(),
  country: z.string().min(1, 'Please select a country'),
  contactDate: z.string().optional(),
  companySize: z.string().optional(),
});

export const LeadForm = (props: LeadFormProps) => {
  const [formData, setFormData] = createSignal<Partial<LeadFormData>>({});
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [touched, setTouched] = createSignal<Record<string, boolean>>({});
  const [submitted, setSubmitted] = createSignal(false);

  const validateField = (field: keyof LeadFormData, value: string) => {
    try {
      const schema = LeadFormSchema.shape[field];
      schema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: 'Invalid input' }));
      }
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Validate all required fields
    const result = LeadFormSchema.safeParse(formData());
    if (result.success) {
      localStorage.setItem('leadFormData', JSON.stringify(formData()));
      props.onSubmit(result.data as LeadFormData);
    } else {
      // Show errors for all fields on submit
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Only validate if field was touched or form was submitted
    if (touched()[field] || submitted()) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData()[field] || '');
  };

  const shouldShowPhone = () => {
    const country = formData().country;
    return country === 'India' || country === 'USA';
  };

  const shouldShowContactDate = () => {
    const email = formData().email;
    return Boolean(email && email.length > 0);
  };

  const shouldShowCompanySize = () => {
    const country = formData().country;
    return country === 'USA' || country === 'UK';
  };

  const getFieldError = (field: keyof LeadFormData) => {
    return (touched()[field] || submitted()) && errors()[field];
  };

  return (
    <div class="lead-form-container">
      <div class="form-content">
        <h2 class="form-title">Share your queries or comments here. :)</h2>
        
        <div class="form-scroll-container">
          <form onSubmit={handleSubmit} class="lead-form">
            <div class="form-field">
              <label>
                Email Address
                <span class="required-mark">*</span>
              </label>
              <input
                type="email"
                placeholder="Please enter your email address"
                value={formData().email || ''}
                onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                onBlur={() => handleBlur('email')}
                class={getFieldError('email') ? 'error-input' : ''}
              />
              {getFieldError('email') && <span class="error">Please enter a valid email</span>}
            </div>

            <div class="form-field">
              <label>
                Full Name
                <span class="required-mark">*</span>
              </label>
              <input
                type="text"
                placeholder="Please enter your full name"
                value={formData().name || ''}
                onInput={(e) => handleInputChange('name', e.currentTarget.value)}
                onBlur={() => handleBlur('name')}
                class={getFieldError('name') ? 'error-input' : ''}
              />
              {getFieldError('name') && <span class="error">Please enter your full name</span>}
            </div>

            <div class="form-field">
              <label>
                Select Country
                <span class="required-mark">*</span>
              </label>
              <div class="select-wrapper">
                <select
                  value={formData().country || ''}
                  onChange={(e) => handleInputChange('country', e.currentTarget.value)}
                  onBlur={() => handleBlur('country')}
                  class={getFieldError('country') ? 'error-input' : ''}
                >
                  <option value="">Select Country</option>
                  <For each={['India', 'USA', 'UK', 'Australia']}>
                    {(country) => <option value={country}>{country}</option>}
                  </For>
                </select>
              </div>
              {getFieldError('country') && <span class="error">Please select a country</span>}
            </div>

            <Show when={shouldShowPhone()}>
              <div class="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Please enter your phone number"
                  value={formData().phone || ''}
                  onInput={(e) => handleInputChange('phone', e.currentTarget.value)}
                  onBlur={() => handleBlur('phone')}
                  class={getFieldError('phone') ? 'error-input' : ''}
                />
                {getFieldError('phone') && <span class="error">Please enter a valid phone number</span>}
              </div>
            </Show>

            <Show when={shouldShowContactDate()}>
              <div class="form-field">
                <label>Preferred Contact Date</label>
                <div class="date-input-wrapper">
                  <input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={formData().contactDate || ''}
                    onInput={(e) => handleInputChange('contactDate', e.currentTarget.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </Show>

            <Show when={shouldShowCompanySize()}>
              <div class="form-field">
                <label>Company Size</label>
                <div class="select-wrapper">
                  <select
                    value={formData().companySize || ''}
                    onChange={(e) => handleInputChange('companySize', e.currentTarget.value)}
                  >
                    <option value="">Select company size</option>
                    <For each={['1-10', '11-50', '51-200', '201-1000', '1000+']}>
                      {(size) => <option value={size}>{size}</option>}
                    </For>
                  </select>
                </div>
              </div>
            </Show>

            <button 
              type="submit" 
              class="submit-button"
            >
              Start Conversation
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .lead-form-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .form-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-scroll-container {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .form-scroll-container::-webkit-scrollbar {
          width: 6px;
        }

        .form-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .form-scroll-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 24px;
        }

        .lead-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .required-mark {
          color: #FF0000;
        }

        .form-field input,
        .form-field select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 15px;
          color: #374151;
          background: white;
          transition: all 0.2s;
        }

        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #2563EB;
        }

        .error-input {
          border-color: #FF0000 !important;
          background-color: #FFF5F5 !important;
        }

        .form-field input::placeholder {
          color: #9CA3AF;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          appearance: none;
          width: 100%;
          padding-right: 40px;
          cursor: pointer;
        }

        .select-wrapper::after {
          content: "▼";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: #6B7280;
          pointer-events: none;
        }

        .date-input-wrapper {
          position: relative;
        }

        .date-input-wrapper input[type="date"] {
          width: 100%;
        }

        .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 10px;
          cursor: pointer;
        }

        .error {
          color: #FF0000;
          font-size: 14px;
          margin-top: 4px;
        }

        .submit-button {
          background: #6B7280;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
          width: 100%;
        }

        .submit-button:hover {
          opacity: 0.9;
        }

        @media (max-width: 480px) {
          .form-content {
            padding: 16px;
          }

          .form-title {
            font-size: 20px;
          }

          .form-field label {
            font-size: 14px;
          }

          .form-field input,
          .form-field select {
            padding: 10px 14px;
            font-size: 14px;
          }

          .submit-button {
            padding: 14px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! Our team will get back to you shortly.'
    });

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4">
            <span className="block text-gray-900">Get in Touch</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">We'd love to hear from you</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mt-4">
            Have questions about our platform or need assistance with your events? Our team is here to help you succeed.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-blue-600">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email Us</h3>
                    <p className="text-gray-600 mt-1">support@eventhorizon.com</p>
                    <p className="text-gray-600">partners@eventhorizon.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Call Us</h3>
                    <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri: 9AM - 6PM PST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Visit Us</h3>
                    <p className="text-gray-600 mt-1">123 Event Street</p>
                    <p className="text-gray-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Trusted by Event Professionals</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">10,000+ Organizers</p>
                  </div>
                  <div className="bg-blue-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">500+ Venues</p>
                  </div>
                  <div className="bg-blue-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">1M+ Attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-blue-600">Send Us a Message</h2>

              {formStatus.submitted ? (
                <motion.div
                  className={`p-6 rounded-xl ${formStatus.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'} flex items-center`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formStatus.success ?
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" /> :
                    <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                  }
                  <p className="text-gray-700">{formStatus.message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center"
                  >
                    <span>Send Message</span>
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-3 text-blue-600">How do I create an event?</h3>
              <p className="text-gray-600">
                Sign up for an EventHorizon account, navigate to your dashboard, and click "Create Event."
                Follow the step-by-step process to set up your event details, ticketing options, and promotional materials.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-3 text-blue-600">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and Apple Pay. For event organizers,
                we offer direct deposit to your bank account with payments processed within 2-3 business days.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-3 text-blue-600">Can I get a refund for my tickets?</h3>
              <p className="text-gray-600">
                Refund policies are set by event organizers. Check the specific event's details page for
                refund information. If you need assistance, our support team is happy to help mediate.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-3 text-blue-600">Do you offer promotional tools?</h3>
              <p className="text-gray-600">
                Yes! EventHorizon provides comprehensive promotional tools including social media integration,
                email marketing templates, QR codes, and analytics to help maximize your event's reach and attendance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

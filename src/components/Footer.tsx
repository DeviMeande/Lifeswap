const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disclaimer</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This website is created for learning purposes only. The information provided here should not be considered professional advice. While we strive for accuracy, we make no guarantees regarding the completeness or reliability of the content. Any actions you take based on this information are at your own risk. We are not liable for any losses or damages incurred from the use of this website.
          </p>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LifeSwap. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

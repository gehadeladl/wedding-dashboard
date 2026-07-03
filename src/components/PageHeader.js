import { Breadcrumb, Button, Col, Row } from "antd";
import Link from "next/link";

export default function PageHeader({
  title,
  breadcrumb = [],
  buttonText,
  buttonLink,
  onButtonClick,
}) {
  return (
    <Row
      justify="space-between"
      align="middle"
      style={{
        marginBottom: 20,
      }}
    >
      <Col>
        <h2
          style={{
            margin: 0,
          }}
        >
          {title}
        </h2>

        {breadcrumb.length > 0 && (
          <Breadcrumb
            style={{
              marginTop: 5,
            }}
          >
            {breadcrumb.map((item, index) => (
              <Breadcrumb.Item key={index}>
                {item.href ? (
                  <Link href={item.href}>{item.title}</Link>
                ) : (
                  item.title
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
      </Col>

      {buttonText && (
        <Col>
          {buttonLink ? (
            <Link href={buttonLink}>
              <Button type="primary">{buttonText}</Button>
            </Link>
          ) : (
            <Button type="primary" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </Col>
      )}
    </Row>
  );
}
